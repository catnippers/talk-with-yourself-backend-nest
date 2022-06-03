import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import AuthDto, {
  LoginRequest,
  RefreshTokenRequest,
  SignUpRequest,
} from './auth.dto';
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
  async authenticate(@Body() loginRequest: LoginRequest): Promise<AuthDto> {
    return await this.authService.authenticateUser(loginRequest);
  }

  @Post('/email-verification/')
  async sendVerificationMail(
  ): Promise<string> {
    return '';
  }

  @Post('/email-verification/verify-code')
  async verifyCode(
    @Body() body: VerificationRequest,
  ): Promise<void> {
    const { email, code } = body;
    return await this.authService.verifyEmailCode(email, code);
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<UserDto> {
    return await this.authService.signUpUser(request);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() request: RefreshTokenRequest,
  ): Promise<{ accessToken: string }> {
    const { userId, refreshToken } = request;
    return await this.authService.refreshToken(refreshToken, userId);
  }
}
