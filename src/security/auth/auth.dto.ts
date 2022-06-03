import {
  IsEmail,
  IsJWT,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export default class AuthDto {
  id: number;
  email: string;
  accessToken: string;
  refreshToken: string;

  constructor(
    id: number,
    email: string,
    accessToken: string,
    refreshToken: string,
  ) {
    this.id = id;
    this.email = email;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RefreshTokenRequest {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}

export class SignUpRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
