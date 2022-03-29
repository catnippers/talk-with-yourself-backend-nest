import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import PrismaService from './config/prisma/prisma.service';
import EntryModule from './entry/entry.module';
import { AuthModule } from './security/auth/auth.module';
import { JwtAuthGuard } from './security/auth/guards/jwt.auth.guard';
import SecurityModule from './security/security.module';
import { UserController } from './user/user.controller';
import UserModule from './user/user.module';
import UserService from './user/user.service';

@Module({
  imports: [AuthModule, UserModule, EntryModule, SecurityModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
