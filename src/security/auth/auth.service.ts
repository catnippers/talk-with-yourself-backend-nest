import { Body, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import UserService from 'src/user/user.service';
import { LoginRequest, SignUpRequest } from './auth.dto';
import JwtUtil, { Claims } from './jwt/jwt.util';
import AuthDto from './auth.dto';

import {
  FailedAuthentication,
  InvalidRefreshToken,
  UserExistsException,
  UserNotFoundException,
} from 'src/exception/auth.exceptions';
import SecurityUtil from '../security.util';
import { UserDto } from 'src/user/user.dto';
import PrismaService from 'src/config/prisma/prisma.service';
import {
  InvalidVerificationCodeException,
  UnverifiedEmailException,
} from 'src/exception/email.verification.exceptions';
import EmailSender from 'src/config/email/email.sender';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface AuthService {
  authenticateUser(loginRequest: LoginRequest): Promise<AuthDto>;
  refreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<{ accessToken: string }>;
  signUpUser(signUpRequest: SignUpRequest): Promise<UserDto>;
}

@Injectable()
export default class AuthServiceImpl implements AuthService {
  private readonly logger = new Logger(AuthServiceImpl.name);

  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtUtil: JwtUtil,
    private securityUtil: SecurityUtil,
    private eventEmitter: EventEmitter2
  ) {}

  async verifyEmailCode(email: string, code: string): Promise<void> {
    return await this.userService.verifyUser(email, code);
  }

  async authenticateUser(loginRequest: LoginRequest): Promise<AuthDto> {
    const { email, password } = loginRequest;
    const user = await this.userService.findUserByEmail(email, new UnauthorizedException("Invalid username or password"));
    if (
      !(await this.securityUtil
        .passwordEncoder()
        .match(password, user.password))
    ) {
      throw new FailedAuthentication('Invalid username or password');
    }

    const refreshTokenObject = this.jwtUtil.generateRefreshToken(user);
    await this.prisma.user.update({
      where: { email: email },
      data: {
        refresh_token_id: refreshTokenObject.jti,
      },
    });

    return {
      id: user.id,
      email: user.email,
      accessToken: this.jwtUtil.generateJwt(user),
      refreshToken: refreshTokenObject.refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {

    const { sub, jti }: Claims = this.jwtUtil.verifyJwt(refreshToken);
    const user = await this.userService.findUserById(Number.parseInt(sub), new UnauthorizedException("Invalid token"));
    if (jti !== user.refresh_token_id) {
      throw new InvalidRefreshToken('Invalid refresh token');
    }

    return {
      accessToken: this.jwtUtil.generateJwt(user),
    };
  }

  async signUpUser(signUpRequest: SignUpRequest): Promise<UserDto> {
    const user = await this.userService.signUpUser(signUpRequest);
    this.eventEmitter.emit('user.registered', user);
    return new UserDto(user);
  }
}
