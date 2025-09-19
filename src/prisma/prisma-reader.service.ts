import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaReaderService extends PrismaService {
  constructor() {
    const connectionUrl =
      process.env.DATABASE_READER_URL || process.env.DATABASE_URL;
    super(connectionUrl);
  }
}
