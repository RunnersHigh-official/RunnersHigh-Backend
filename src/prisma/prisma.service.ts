import { Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(@Optional() connectionUrl?: string) {
    super({
      log: [{ emit: 'event', level: 'query' }],

      ...(connectionUrl && {
        datasources: { db: { url: connectionUrl } },
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
