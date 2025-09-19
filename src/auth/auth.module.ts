import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppLevelStrategy } from './strategy/app-level.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AppLevelStrategy],
  exports: [AuthService],
})
export class AuthModule {}
