import { HttpException, Injectable, Logger } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import EmailSender from 'src/config/email/email.sender';

import PrismaService from 'src/config/prisma/prisma.service';
import { generateRandomNumber } from 'src/config/util/util';
import { UserExistsException, UserNotFoundException } from 'src/exception/auth.exceptions';
import {
  InvalidVerificationCodeException,
  UnverifiedEmailException,
} from 'src/exception/email.verification.exceptions';
import { SignUpRequest } from 'src/security/auth/auth.dto';
import SecurityUtil from 'src/security/security.util';

interface UserService {
  findUserByEmail(email: string, exception?: HttpException): Promise<User>;
  findUserById(id: number, exception?: HttpException): Promise<User>;
  signUpUser(signUpRequest: SignUpRequest): Promise<User>;
  userExists(email: string): Promise<boolean>;
}

@Injectable()
export default class UserServiceImpl implements UserService {
  private logger: Logger = new Logger();
  constructor(
    private prisma: PrismaService,
    private securityUtil: SecurityUtil,
  ) {}

  async userExists(email: string): Promise<boolean> {
    return (await this.findUserByEmail(email)) ? true : false;
  }

  async signUpUser(signUpRequest: SignUpRequest): Promise<User> {
    const { email, password, firstName, lastName } = signUpRequest;
    if (await this.userExists(email)) {
      throw new UserExistsException("User exists");
    }
    return await this.prisma.user.create({
      data: {
        email: email,
        password: await this.securityUtil.passwordEncoder().encode(password),
        first_name: firstName,
        last_name: lastName,
        verification_code: await (
          await this.generateVerificationCode()
        ).toString(),
        refresh_token_id: null,
      },
    });
  }

  private async generateVerificationCode(): Promise<number> {
    return generateRandomNumber(999999, 99999);
  }

  async findUserById(id: number, exception?: HttpException): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user && exception) {
      throw exception;
    }
    return user;
  }

  async findUserByEmail(email: string, exception?: HttpException): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user && exception) {
      throw exception;
    }
    return user;
  }

  async verifyUser(email: string, code: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (user.verified) {
      return;
    }
    if (user.verification_code !== code) {
      throw new InvalidVerificationCodeException('Code invalid');
    }
    this.prisma.user.update({
      where: { email: email },
      data: {
        verified: true,
      },
    });
  }
}
