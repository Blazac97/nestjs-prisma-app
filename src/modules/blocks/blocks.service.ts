// Создаём сервис для работы с блоками.
import { Injectable, NotFoundException } from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import { PrismaException } from '../../prisma/prisma.helpers';
import { PrismaService } from '../../prisma/prisma.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService, private filesService: FilesService) {}

  // Метод для поиска блока по "группе"
  async search(data: Prisma.BlockWhereInput) {
    const foundBlocks = await this.prisma.block.findMany({
      where: data,
    });
    return foundBlocks;
  }

  // Метод для создания блока с возможностью (по желанию) добавления картинки.
  async create(data: Prisma.BlockCreateInput, picture?: Express.Multer.File) {
    let createdFiles: File[] | null = null;
    if (picture) {
      createdFiles = await this.filesService.create([
        {
          fileName: picture.filename,
          mime: picture.mimetype,
          path: picture.path,
        },
      ]);
    }

    const createPicture = createdFiles
      ? {
          picture: {
            connect: {
              id: createdFiles[0].id,
            },
          },
        }
      : {};
    const createdBlock = await this.prisma.block.create({
      data: {
        ...data,
        ...createPicture,
      },
      include: {
        picture: true,
      },
    });
    if (createdFiles) {
      await this.filesService.createFileRelations([
        {
          fileId: createdFiles[0].id,
          resourceName: 'blocks',
          resourceId: createdBlock.id,
        },
      ]);
    }

    return createdBlock;
  }

  // Метод для вывода всех блоков.
  async findAll() {
    const allBlocks = await this.prisma.block.findMany({
      include: {
        picture: true,
      },
    });
    return allBlocks;
  }

  // Метод для вывода блока по id.
  async findOne(id: number) {
    const block = await this.prisma.block.findUnique({
      where: {
        id: id,
      },
      include: {
        picture: true,
      },
    });
    if (!block) throw new NotFoundException();
    return block;
  }

  // Метод для редактирования блока и (по желанию) изменения картинки.
  async update(id: number, data: Prisma.BlockUpdateInput, picture?: Express.Multer.File) {
    try {
      let createdFiles: File[] | null = null;
      if (picture) {
        createdFiles = await this.filesService.create([
          {
            fileName: picture.filename,
            mime: picture.mimetype,
            path: picture.path,
          },
        ]);
      }

      if (createdFiles) {
        await this.filesService.removeFileRelations({
          resourceName: 'blocks',
          resourceId: id,
        });

        await this.filesService.createFileRelations([
          {
            fileId: createdFiles[0].id,
            resourceName: 'blocks',
            resourceId: id,
          },
        ]);
      }

      const createPicture = createdFiles
        ? {
            picture: {
              connect: {
                id: createdFiles[0].id,
              },
            },
          }
        : {};
      const updatedBlock = await this.prisma.block.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          ...createPicture,
        },
        include: {
          picture: true,
        },
      });

      return updatedBlock;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PrismaException.ENTITY_NOT_FOUND) {
          throw new NotFoundException();
        }
      }

      throw e;
    }
  }

  // Метод для удаления блока(удаляется ещё и запись в таблице отношений, поскольку необходимо "указать", что файл уже не связан с этим блоком).
  async remove(id: number) {
    try {
      const removedBlock = await this.prisma.block.delete({
        where: {
          id: id,
        },
        include: {
          picture: true,
        },
      });
      await this.filesService.removeFileRelations({
        resourceName: 'blocks',
        resourceId: id,
      });
      return removedBlock;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PrismaException.ENTITY_NOT_FOUND) {
          throw new NotFoundException();
        }
      }

      throw e;
    }
  }
}
