// Создаём декоратор,который позволяет присваивать роль, необходимую для доступа к эднпоинту.
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleParam, RolesGuard } from 'src/guards/RolesGuard.guard';

// Интерфейс
interface IRolesParams {
  roles: RoleParam[];
  resource?: string;
  resourceParamId?: string;
  authorField?: string;
}

// Помимо самой "роли", ещё реализуем тут и далее в RolesGuard проверку на "авторство". Чтобы обычный юзер мог совершать CRUD операции только со своим профилем (сголасно заданию).
export const Roles = ({
  roles,
  resource,
  authorField = 'creatorId',
  resourceParamId,
}: IRolesParams) => {
  return applyDecorators(
    UseGuards(RolesGuard),
    SetMetadata('ROLES_GUARD_roles', roles),
    SetMetadata('ROLES_GUARD_resource', resource),
    SetMetadata('ROLES_GUARD_authorField', authorField),
    SetMetadata('ROLES_GUARD_resourceParamId', resourceParamId)
  );
};
