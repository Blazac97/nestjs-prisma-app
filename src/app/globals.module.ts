import { Global, Module } from '@nestjs/common';
import { UniqueConstraint } from '../validation/UniqueConstraint.validator';

@Global()
@Module({
  providers: [UniqueConstraint],
  exports: [UniqueConstraint],
})
export class GlobalsModule {}
