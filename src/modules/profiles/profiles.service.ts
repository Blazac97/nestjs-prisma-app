// Создаём сервис для работы с профилями.
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaException } from '../../prisma/prisma.helpers';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}
  // Метод для созадния профиля, помимо этого создаётся и user.
  async create(data: Prisma.ProfileCreateInput) {
    const createdProfile = await this.prisma.profile.create({
      data,
      include: {
        user: true,
      },
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete createdProfile['user']['password'];
    return createdProfile;
  }

  // Метод для поиска профиля по id.
  async findOne(
    profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput
  ): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: profileWhereUniqueInput,
      include: {
        user: true,
      },
    });
  }

  // Метод для поиска профиля по почте(email).
  async findOneByEmail(email: string) {
    return this.prisma.profile.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: {
        user: true,
      },
    });
  }

  // Метод для редактирования профиля.
  async update(id: number, data: Prisma.ProfileUpdateInput) {
    try {
      const updateProfile = await this.prisma.profile.update({
        where: {
          id: id,
        },
        data,
      });
      return updateProfile;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PrismaException.ENTITY_NOT_FOUND) {
          throw new NotFoundException();
        }
      }

      throw e;
    }
  }

  // Метод для удаления профиля. При удалении профиля, соотвествующий юзер удаляется тоже.
  // В shema.prisma для этих связей используется каскадное удаление.
  async remove(id: number) {
    try {
      const removedProfile = await this.prisma.profile.delete({
        where: {
          id: id,
        },
      });
      return removedProfile;
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
