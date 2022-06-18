import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/config/util/decorators';
import UserService from 'src/user/user.service';
import JwtUtil from '../jwt/jwt.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtUtil: JwtUtil,
    private userService: UserService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request: Request = context.getArgByIndex(0);
    
    const token = request?.cookies?.AccessToken;
    if (!token) {
      throw new UnauthorizedException("you are unauthorized to access this route");
    }
    const sub = this.jwtUtil.extractClaimFromToken(token, 'sub');
    return new Promise<boolean>((resolve, reject) => {
      this.userService
        .findUserById({
          id: Number.parseInt(sub)
        })
        .then((user) => {
          if (user && user.verified) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => resolve(false));
    });
  }
}
