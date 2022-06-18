import { HttpException, Injectable, Logger } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

import EmailSender from 'src/config/email/email.sender';
import PrismaService from 'src/config/prisma/prisma.service';
import { computeTimeDifference, generateRandomNumber } from 'src/config/util/util';
import { UserExistsException, UserNotFoundException } from 'src/exception/auth.exceptions';
import {
  ExpiredVerificationCode,
  InvalidVerificationCodeException,
  UnverifiedEmailException,
} from 'src/exception/email.verification.exceptions';
import { SignUpRequest } from 'src/security/auth/auth.dto';
import SecurityUtil from 'src/security/security.util';

interface UserService {
  findUserByEmail({email, exception}: { email: string, exception?: HttpException }): Promise<User>;
  findUserById({id, exception}: {id: number,exception?: HttpException}): Promise<User>;
  signUpUser(signUpRequest: SignUpRequest): Promise<User>;
  userExists(email: string): Promise<boolean>;
}

@Injectable()
export default class UserServiceImpl implements UserService {
  private logger: Logger = new Logger();
  constructor(
    private prisma: PrismaService,
    private securityUtil: SecurityUtil,
    private emailSender: EmailSender
  ) {}

  async userExists(email: string): Promise<boolean> {
    return (await this.findUserByEmail({email: email})) ? true : false;
  }

  async signUpUser(signUpRequest: SignUpRequest): Promise<User> {
    const { email, password, firstName, lastName } = signUpRequest;
    if (await this.userExists(email)) {
      throw new UserExistsException("User exists");
    }
    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: await this.securityUtil.passwordEncoder().encode(password),
        first_name: firstName,
        last_name: lastName,
        verification_code: this.generateVerificationCode(),
        refresh_token_id: null,
      },
    });
    const { verification_code } = user
    await this.emailSender.sendEmail(
      email,
      'TWY Email Verification',
      verification_code
    );
    return user;
  }

  async resendVerificationMail(email: string): Promise<void> {
    if (! await this.userExists(email)) {
      throw new UserNotFoundException('Invalid email');
    } 
    const user = await this.prisma.user.update({
      where: {email: email},
      data: {
        verification_code: this.generateVerificationCode()
      }
    });
    const { verification_code } = user;
    this.emailSender.sendEmail(
      email,
      'TWY Email Verification',
      verification_code
    );
  }

  private generateVerificationCode(): string {
    return generateRandomNumber(999999, 99999).toString();
  }

  async findUserById({
    id, exception
  }: {
    id: number,
    exception?: HttpException
  }): Promise<User> {
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

  async findUserByEmail({email, exception}: {email: string, exception?: HttpException}): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user && exception) {
      throw exception;
    }
    return user;
  }

  async verifyUser(email: string, code: string): Promise<void> {
    const user = await this.findUserByEmail({
      email: email,
      exception: new UserNotFoundException('User not found')
    });
    if (user.verified) {
      return;
    }
    if (computeTimeDifference(new Date(), user.updatedAt) > (1000 * 60 * 10)) {
      throw new ExpiredVerificationCode("verification code expired");
    }
    if (user.verification_code !== code) {
      throw new InvalidVerificationCodeException('Code invalid');
    }
    await this.prisma.user.update({
      where: { email: email },
      data: {
        verified: true,
      },
    });
  }
}
