// Создаём гуард для разграничения доступа в зависимости от ролей к эндпоинту.
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, Scope } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Profile, Role, User } from '@prisma/client';

export interface ProfilePopulated extends Profile {
  user: User;
}

export interface ICheckPayload {
  user: ProfilePopulated;
  entity: any;
}

export enum RoleParam {
  admin = 'admin',
  creator = 'creator',
}
// Создаём Guard.
@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleParam[]>(
      'ROLES_GUARD_roles',
      context.getHandler()
    );
    if (!roles) return true;

    const resource = this.reflector.get<string>(
      'ROLES_GUARD_resource',
      context.getHandler()
    );
    const authorField = this.reflector.get<string>(
      'ROLES_GUARD_authorField',
      context.getHandler()
    );
    const resourceParamId = this.reflector.get<string>(
      'ROLES_GUARD_resourceParamId',
      context.getHandler()
    );

    const request = context.switchToHttp().getRequest();
    const profile = request.user as ProfilePopulated;

    const { roles: userRoles } = profile.user;

    for (let i = 0; i < roles.length; i += 1) {
      const roleToCheck = roles[i];

      let result = false;
      switch (roleToCheck) {
        // isAdmin
        case RoleParam.admin:
          result = userRoles.includes(Role.ADMIN);
          break;

        // isCreator
        case RoleParam.creator:
          if (!resource) return false;

          const resourceId = request.params[resourceParamId];

          const resourceRecord = await this.prisma[resource].findFirst({
            where: { id: Number(resourceId) },
          });

          result = resourceRecord
            ? resourceRecord[authorField] === profile.user.id
            : false;
          break;
      }

      // Даём доступ к ресурсу.
      if (result) return true;
    }
    return false;
  }
}
