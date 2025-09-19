import { Module } from '@nestjs/common';
import { RunningController } from './running.controller';
import { RunningService } from './running.service';

@Module({
  controllers: [RunningController],
  providers: [RunningService],
  exports: [RunningService],
})
export class RunningModule {}