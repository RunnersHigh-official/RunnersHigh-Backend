import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AppLevelGuard extends AuthGuard('bearer-app') {}
