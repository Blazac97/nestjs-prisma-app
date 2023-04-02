// Создаём модуль блоков.
import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [BlocksController],
  providers: [BlocksService],
})
export class BlocksModule {}
