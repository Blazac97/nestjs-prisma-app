// Создаём Data Transfer Object для логина.
import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: User['email'];

  @IsNotEmpty()
  password: string;
}
