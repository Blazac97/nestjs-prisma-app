// Создаём модуль для работы с файлами.
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FILES_UPLOAD_DESTINATION } from './files.constants';
// Будем использовать multer для загрузки сразу нескольких файлов.
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: FILES_UPLOAD_DESTINATION,
        filename: (req, file, callback) => {
          // https://gabrieltanner.org/blog/nestjs-file-uploading-using-multer/
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`.replace(/\s/gi, '_'));
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [MulterModule, FilesService],
})
export class FilesModule {}
