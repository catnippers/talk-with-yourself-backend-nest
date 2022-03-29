import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/config/util/decorators';
import SecurityUtil from 'src/security/security.util';
import JwtUtil from '../jwt/jwt.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private securityUtil: SecurityUtil,
        private jwtUtil: JwtUtil
        ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        const request: Request = context.getArgByIndex(0);
        const authHeader = request.header('Authorization');

        if(!authHeader) {
            throw new UnauthorizedException("You are unauthorized to access this route");
        } 

        const token = authHeader.substring(7, request.header('Authorization').length);


        const userId: string = this.securityUtil.extractUserIdFromRoute(request.url);
        const sub = this.jwtUtil.extractClaimFromToken(token, 'sub');

        
        if(sub !== userId) {
            throw new UnauthorizedException("You seem lost");
        }

        return super.canActivate(context);
    }
}
