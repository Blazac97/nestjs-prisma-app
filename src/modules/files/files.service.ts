// Создаём сервис для работы с файлами.
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaException } from 'src/prisma/prisma.helpers';
import { removePhysicalFile, removePhysicalFiles, subtractHours } from './files.utils';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  // Метод для удаления файлов с момента создания которых прошло более 1 часа и они нигде не используются.
  async cleanup() {
    // Из-за особенностей SQL и призмы приходится дублировать запрос...
    // https://github.com/prisma/prisma/issues/13596
    const whereCondition = {
      createdAt: {
        lte: subtractHours(new Date(), 1),
      },
      fileRelations: {
        none: {},
      },
    };
    const [filesToDelete] = await this.prisma.$transaction([
      this.prisma.file.findMany({
        where: whereCondition,
      }),
      this.prisma.file.deleteMany({
        where: whereCondition,
      }),
    ]);
    await removePhysicalFiles(filesToDelete.map(file => join(process.cwd(), file.path)));
    return filesToDelete;
  }

  // Метод для создания связей между файлом и сущьностью , где он используется.
  createFileRelations(data: Prisma.FileRelationsCreateManyInput[]) {
    return this.prisma.fileRelations.createMany({
      data,
    });
  }

  // Метод для удаления связей между файлом и сущностью , где он используется.
  removeFileRelations(data: Prisma.FileRelationsWhereInput) {
    return this.prisma.fileRelations.deleteMany({
      where: data,
    });
  }

  // Метод для загрузки/создания файлов.
  create(data: Prisma.FileCreateManyInput[]) {
    // https://github.com/prisma/prisma/issues/8131#issuecomment-997667070
    return this.prisma.$transaction(
      data.map(fileData => this.prisma.file.create({ data: fileData }))
    );
  }

  // Метод для удаления файла по id.
  async remove(id: number) {
    try {
      const removedFile = await this.prisma.file.delete({
        where: {
          id: id,
        },
      });
      await removePhysicalFile(join(process.cwd(), removedFile.path));
      return removedFile;
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
