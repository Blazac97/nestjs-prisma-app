// Создаём Data Transfer Object для регистрации пользователя.
import { Profile, User } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Unique } from '../../../validation/UniqueConstraint.validator';

export class RegisterDto {
  @IsEmail()
  // Используем кастомный декоратор для проверки уникальности email.
  @Unique('user', 'email')
  email: User['email'];

  @IsNotEmpty()
  phone: Profile['phone'];

  @IsNotEmpty()
  address: Profile['address'];

  @IsNotEmpty()
  name: Profile['name'];

  @IsNotEmpty()
  lastName: Profile['lastName'];

  @IsNotEmpty()
  password: string;
}
