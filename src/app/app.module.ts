// Главный файл приложения, тут регистрируем все наши модули,утилиты и т.д.
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProfilesModule } from 'src/modules/profiles/profiles.module';
import { FilesModule } from 'src/modules/files/files.module';
import { BlocksModule } from 'src/modules/blocks/blocks.module';
import { GlobalsModule } from './globals.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Serving statics
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // База данных.
    PrismaModule,

    // Утилиты.
    GlobalsModule,
    BcryptModule,

    // Сущности/бизнес логика.
    ProfilesModule,
    AuthModule,
    FilesModule,
    BlocksModule,
  ],
})
export class AppModule {}
