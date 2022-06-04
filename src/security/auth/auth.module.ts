import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';

import { JwtStrategy } from './strategies/jwt.strategy';
import AuthController from './auth.controller';
import UserModule from 'src/user/user.module';
import AuthService from './auth.service';
import SecurityModule from '../security.module';
import EmailSenderImpl from 'src/config/email/email.sender';
import PrismaService from 'src/config/prisma/prisma.service';

@Module({
  imports: [PassportModule, UserModule, SecurityModule],
  providers: [
    AuthService,
    JwtStrategy,
    EmailSenderImpl,
    PrismaService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
