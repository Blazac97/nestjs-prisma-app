// Создаём Data Transfer Object для редактирования профиля.
// DTO для создания профиля мы используем при регистрации.
import { Profile, User } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  phone: Profile['phone'];

  @IsNotEmpty()
  address: Profile['address'];

  @IsNotEmpty()
  name: Profile['name'];

  @IsNotEmpty()
  lastName: Profile['lastName'];

  @IsEmail()
  email: User['email'];
}
