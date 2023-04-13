// Контроллер файлов.
import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../decorators/Roles.decorator';
import { RoleParam } from '../../guards/RolesGuard.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// Обрабатываем запросы по указанным эндпоинтам.
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Декораторы для проверки токена авторизации и прав доступа к эндпоинту,для загрузки файлов на сервер.
  @UseInterceptors(FilesInterceptor('files', 5))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const filesRecords = await this.filesService.create(
      files.map(file => ({
        path: file.path.replace('\\', '/'),
        fileName: file.filename,
        mime: file.mimetype,
      }))
    );
    return filesRecords;
  }

  // Декораторы для проверки токена авторизации и прав доступа к эндпоинту.
  @Roles({
    roles: [RoleParam.admin],
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }

  // Декораторы для проверки токена авторизации и прав доступа к эндпоинту.
  @Roles({
    roles: [RoleParam.admin],
  })
  @UseGuards(JwtAuthGuard)
  @Post('cleanup')
  cleanup() {
    return this.filesService.cleanup();
  }
}
