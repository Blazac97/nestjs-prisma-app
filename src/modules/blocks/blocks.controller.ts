// Создаём контроллер для блоков.
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../decorators/Roles.decorator';
import { RoleParam } from '../../guards/RolesGuard.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// Обрабатываем запросы по указанным эндпоинтам.
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}
  // Тут не используем декоратор для проверки ролей доступа.
  @UseGuards(JwtAuthGuard)
  @Post('search')
  search(@Query('group') group) {
    return this.blocksService.search({
      group: {
        equals: group,
      },
    });
  }

  // Декоратор , который позволяет загружать файл.
  @UseInterceptors(FileInterceptor('picture'))
  // Декоратор для определения роли , которая имеет доступ к эндпоинту.
  @Roles({
    roles: [RoleParam.admin],
  })
  // Декоратор для проверки токена авторизации.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createBlockDto: CreateBlockDto,
    @UploadedFile() picture: Express.Multer.File
  ) {
    return this.blocksService.create(createBlockDto, picture);
  }

  // Декоратор для проверки токена авторизации.
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.blocksService.findAll();
  }

  // Декоратор для проверки токена авторизации.
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(+id);
  }

  // Декоратор , который позволяет загружать файл.
  @UseInterceptors(FileInterceptor('picture'))
  // Декоратор для определения роли , которая имеет доступ к эндпоинту.
  @Roles({
    roles: [RoleParam.admin],
  })
  // Декоратор для проверки токена авторизации.
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlockDto: UpdateBlockDto,
    @UploadedFile() picture: Express.Multer.File
  ) {
    return this.blocksService.update(+id, updateBlockDto, picture);
  }

  // Декоратор для определения роли , которая имеет доступ к эндпоинту.
  @Roles({
    roles: [RoleParam.admin],
  })
  // Декоратор для проверки токена авторизации.
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blocksService.remove(+id);
  }
}
