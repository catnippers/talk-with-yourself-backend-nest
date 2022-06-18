import { DynamicModule, Module } from '@nestjs/common';

import UserService from './user.service';
import EmailSender from 'src/config/email/email.sender';
import SecurityModule from 'src/security/security.module';
import { UserController } from './user.controller';
import PrismaService from 'src/config/prisma/prisma.service';

@Module({
  imports: [SecurityModule],
  controllers: [UserController],
  providers: [
    // Services
    UserService,
    PrismaService,
    EmailSender,
  ],
  exports: [UserService],
})
export default class UserModule {}
