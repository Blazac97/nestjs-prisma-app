// Создаём Data Transfer Object для создания блока.
import { Block } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateBlockDto {
  @IsNotEmpty()
  key: Block['key'];

  @IsNotEmpty()
  name: Block['name'];

  @IsNotEmpty()
  content: Block['content'];

  @IsNotEmpty()
  group: Block['group'];
}
