import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { knownErrors } from '../../common/known-errors';
import { AuthService } from '../auth.service';
import { TokenField } from '../enum/token.field';
import { User } from '../interface/user.interface';

@Injectable()
export class AppLevelStrategy extends PassportStrategy(Strategy, 'bearer_app') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<User> {
    const user = await this.authService.authenticateUser(
      token,
      TokenField.APP_TOKEN,
    );

    if (!user) throw knownErrors.JsonWebTokenError('유효하지 않은 토큰입니다.');

    return user;
  }
}
