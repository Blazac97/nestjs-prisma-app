// Создаём контроллер для работы с профилями.
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { Roles } from '../../decorators/Roles.decorator';
import { RoleParam } from '../../guards/RolesGuard.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
// Обрабатываем запросы по указанным эндпоинтам.
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  // Декораторы для проверки токена авторизации и прав доступа к эндпоинту.
  // В данном случае и далее где встречается такой декоратор @Roles, мы указываем , что для работы с конкретным профилем может только администратор или же сам владелец профиля.
  @Roles({
    roles: [RoleParam.creator, RoleParam.admin],
    resource: 'profile',
    resourceParamId: 'id',
    authorField: 'id',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.profilesService.findOne({
      id,
    });
    if (!data) throw new NotFoundException('Profile not found');

    return data;
  }

  // Декораторы для проверки токена авторизации и прав доступа к эндпоинту.
  @Roles({
    roles: [RoleParam.creator, RoleParam.admin],
    resource: 'profile',
    resourceParamId: 'id',
    authorField: 'id',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  // Декораторы для проверки токена авторизации и прав доступа к эндпоинту.
  @Roles({
    roles: [RoleParam.creator, RoleParam.admin],
    resource: 'profile',
    resourceParamId: 'id',
    authorField: 'id',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
