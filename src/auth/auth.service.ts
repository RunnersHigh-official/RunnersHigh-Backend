import { Injectable } from '@nestjs/common';
import { knownErrors } from '../common/known-errors';
import { PrismaReaderService } from '../prisma/prisma-reader.service';
import { TokenField } from './enum/token.field';
import { User } from './interface/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prismaReader: PrismaReaderService) {}

  private async authenticateAppToken(token: string): Promise<User | null> {
    const user = await this.prismaReader.user.findUnique({
      where: { appToken: token },
      select: {
        id: true,
        nickname: true,
      },
    });

    return user;
  }

  private async authenticateWebToken(token: string): Promise<User | null> {
    const user = await this.prismaReader.user.findUnique({
      where: { webToken: token },
      select: {
        id: true,
        nickname: true,
      },
    });

    return user;
  }

  public async authenticateUser(
    token: string,
    tokenField: TokenField,
  ): Promise<User | null> {
    switch (tokenField) {
      case TokenField.APP_TOKEN:
        return await this.authenticateAppToken(token);
      case TokenField.WEB_TOKEN:
        return await this.authenticateWebToken(token);
      default:
        throw knownErrors.InternalError('알맞은 TokenField가 없습니다.');
    }
  }
}
