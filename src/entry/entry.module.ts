import { Module } from '@nestjs/common';
import PrismaService from 'src/config/prisma/prisma.service';
import EncryptionService from 'src/security/encryption/encryption.service';
import EntryController from './entry.controller';
import EntryService from './entry.service';

@Module({
  imports: [],
  controllers: [EntryController],
  providers: [EncryptionService, EntryService, PrismaService],
  exports: [EntryService],
})
export default class EntryModule {}
