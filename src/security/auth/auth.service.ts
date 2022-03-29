import { Body, Injectable, Logger } from '@nestjs/common';

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
import EmailVerificationService from 'src/user/email-verification/email.verification.service';
import PrismaService from 'src/config/prisma/prisma.service';
import { EmailVerification } from '@prisma/client';
import { InvalidVerificationCodeException, UnverifiedEmailException } from 'src/exception/email.verification.exceptions';

interface AuthService {
    authenticateUser(loginRequest: LoginRequest): Promise<AuthDto>;
    refreshToken(refreshToken: string, userId: number): Promise<{ accessToken: string }>;
    signUpUser(signUpRequest: SignUpRequest): Promise<UserDto>;
    sendEmailVerificationMail(email: string): Promise<string>;
    verifyEmailCode(email: string, code: number): Promise<EmailVerification>;
}

@Injectable()
export default class AuthServiceImpl implements AuthService {
    private readonly logger = new Logger(AuthServiceImpl.name);

    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private emailVerificationService: EmailVerificationService,
        private jwtUtil: JwtUtil,
        private securityUtil: SecurityUtil,
    ) {}

    async verifyEmailCode(email: string, code: number): Promise<EmailVerification> {
        return await this.emailVerificationService.verifyCode(email, code);
    }

    async authenticateUser(loginRequest: LoginRequest): Promise<AuthDto> {

        const { email, password } = loginRequest
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new UserNotFoundException("Invalid username or password");
        }
        if(! await this.securityUtil.passwordEncoder().match(password, user.password)){
            throw new FailedAuthentication("Invalid username or password");
        }

        const refreshTokenObject = this.jwtUtil.generateRefreshToken(user);

        await this.prisma.user.update({
            where: {email: email},
            data: {
                refresh_token_id: refreshTokenObject.jti
            }
        })

        return {
            id: user.id,
            email: user.email,
            accessToken: this.jwtUtil.generateJwt(user),
            refreshToken: refreshTokenObject.refreshToken
        }
    }


    async refreshToken(refreshToken: string, userId: number): Promise<{ accessToken: string }> {
        const user = await this.userService.findUserById(userId);

        if(!user) {
            throw new UserNotFoundException("User not found");
        }


        const claims: Claims = this.jwtUtil.verifyJwt(refreshToken);
        if (claims.jti !== user.refresh_token_id) {
            throw new InvalidRefreshToken("Invalid refresh token");
        }

        return {
            accessToken: this.jwtUtil.generateJwt(user)
        };
    }


    async signUpUser(signUpRequest: SignUpRequest): Promise<UserDto> {

        // const verificationRecord = await this.emailVerificationService.loadVerificationRecord(signUpRequest.email)
        // if(!verificationRecord) {
        //     throw new UnverifiedEmailException("Email not verified");
        // }

        return this.userService.signUpUser(signUpRequest);
    }

    async sendEmailVerificationMail(email: string): Promise<string> {
        return await this.emailVerificationService.sendVerificationEmail(email)
    }

}
