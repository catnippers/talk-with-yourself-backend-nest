import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import AuthDto, { LoginRequest, RefreshTokenRequest, SignUpRequest } from './auth.dto';
import AuthService from './auth.service';
import { Public } from 'src/config/util/decorators';
import { UserDto, VerificationRequest } from 'src/user/user.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@Controller({
  path: '/auth',
  version: '1',
})
@Public()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async authenticate(@Body() loginRequest: LoginRequest, @Res() response: Response) {
    const {
      accessToken,
      id,
      email,
      refreshToken 
    } = await this.authService.authenticateUser(loginRequest);
    const refreshTokenCookie = `RefreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=None; Secure=true; Max-Age=432000`;
    const accessTokenCookie = `AccessToken=${accessToken}; HttpOnly; Path=/; SameSite=None; Secure=true; Max-Age=10000`;

    response.setHeader('Set-Cookie', [
      // accessTokenCookie, 
      refreshTokenCookie]);
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

  @Post('/log-out')
  @UseGuards(JwtAuthGuard)
  async logOut(@Res() response: Response) {
    const logOutCookie = `RefreshToken=; HttpOnly; Path=/; Max-Age=0`;
    response.setHeader('Set-Cookie', logOutCookie);
    return response.status(200).send({});
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<UserDto> {
    return await this.authService.signUpUser(request);
  }

  @Post('/refresh-token')
  async refreshToken(@Res() response: Response, @Req() request: Request) {
    const refreshToken = request?.cookies?.RefreshToken;
    console.log(refreshToken);
    const { accessToken  } = await this.authService.refreshToken(refreshToken);
    const accessTokenCookie = `AccessToken=${accessToken}; HttpOnly; Path=/; SameSite=None; Secure=true; Max-Age=10000`;
    response.setHeader('Set-Cookie', accessTokenCookie);
    return response.status(200)
      .json({});
  }
}
