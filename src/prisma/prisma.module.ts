import { Global, Module } from '@nestjs/common';
import { PrismaReaderService } from './prisma-reader.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, PrismaReaderService],
  exports: [PrismaService, PrismaReaderService],
})
export class PrismaModule {}
