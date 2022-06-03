import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import AuthDto, { LoginRequest, RefreshTokenRequest, SignUpRequest } from './auth.dto';
import AuthService from './auth.service';
import { Public } from 'src/config/util/decorators';
import { UserDto, VerificationRequest } from 'src/user/user.dto';

@Controller({
  path: '/auth',
  version: '1',
})
@Public()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async authenticate(@Body() loginRequest: LoginRequest, @Res() response: Response) {
    const { accessToken, id, email, refreshToken } = await this.authService.authenticateUser(
      loginRequest,
    );
    const refreshTokenCookie = `RefreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=None; Secure=true; Max-Age=432000`;
    const accessTokenCookie = `AccessToken=${accessToken}; HttpOnly; Path=/; SameSite=None; Secure=true; Max-Age=2000`;

    response.setHeader('Set-Cookie', accessTokenCookie);
    response.setHeader('Set-Cookie', refreshTokenCookie);
    return response.status(200)
      .json({
        id: id,
        email: email
      });
  }

  @Post('/email-verification/')
  async sendVerificationMail(): Promise<string> {
    return '';
  }

  @Post('/email-verification/verify-code')
  async verifyCode(@Body() body: VerificationRequest): Promise<void> {
    const { email, code } = body;
    return await this.authService.verifyEmailCode(email, code);
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<UserDto> {
    return await this.authService.signUpUser(request);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest): Promise<{ accessToken: string }> {
    const { userId, refreshToken } = request;
    return await this.authService.refreshToken(refreshToken, userId);
  }
}
