import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RunningController } from './running.controller';
import { RunningService } from './running.service';

@Module({
  imports: [AuthModule],
  controllers: [RunningController],
  providers: [RunningService],
  exports: [RunningService],
})
export class RunningModule {}
