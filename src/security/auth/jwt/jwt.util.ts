import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

import { InvalidRefreshToken } from 'src/exception/auth.exceptions';
import { DecodeJwtError } from 'src/exception/jwt.exceptions';
import { User } from '@prisma/client';

@Injectable()
export default class JwtUtil {
  private readonly logger: Logger = new Logger(JwtUtil.name);

  constructor(private jwtService: JwtService) {}

  generateJwt(appUser: User): string {
    return this.jwtService.sign(
      { ...new Claims(appUser) },
      { secret: process.env.jwtSecret, expiresIn: '300s' },
    );
  }

  generateRefreshToken(appUser: User): { refreshToken: string; jti: string } {
    const tokenId = randomUUID();
    return {
      refreshToken: this.jwtService.sign(
        { sub: appUser.id },
        {
          secret: process.env.refreshTokenSecret,
          jwtid: tokenId,
          expiresIn: '30000s',
        },
      ),
      jti: tokenId,
    };
  }

  decodeJwt(token: string): string | jwt.JwtPayload {
    return this.jwtService.decode(token);
  }

  verifyJwt(token: string): Claims {
    let claims: Claims = null;
    try {
      claims = this.jwtService.verify(token, {
        secret: process.env.refreshTokenSecret,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        'Error while verifying refresh token',
        HttpStatus.CONFLICT,
      );
    }
    return claims;
  }

  extractClaimFromToken(token: string, tokenClaim: string): string {
    const jwtPayload: string | jwt.JwtPayload = this.decodeJwt(token);

    // This checks if the decode function above returns a valid jwt payload
    if (!jwtPayload?.sub) {
      throw new DecodeJwtError('Invalid token');
    }

    const claim: string = jwtPayload[`${tokenClaim}`];

    if (!claim) {
      throw new HttpException(
        'invalid claim',
        HttpStatus.BAD_REQUEST,
      );
    }
    return claim;
  }
}

export class Claims {
  sub: string;
  email: string;
  role: string;
  jti?: string;

  constructor(appUser: User) {
    this.sub = appUser.id.toString();
    this.email = appUser.email;
    this.role = 'USER';
  }
}
