// Создаём сервис шифрования пароля , а так же его "сверки".
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  // Хэшируем пароль.
  hash(plainData: string) {
    return bcrypt.hash(plainData, 15);
  }
  // Сравниваем с тем, что записано в БД.
  compare(plainData: string, hash: string) {
    return bcrypt.compare(plainData, hash);
  }
}
