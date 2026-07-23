import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 tentativas por 5 minutos
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
    } catch (error) {
      console.error('Login controller error:', error);
      throw error;
    }
  }

  @Post('logout')
  async logout() {
    return { message: 'Logout successful' };
  }

  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@Req() req: any) {
    return req.session;
  }
}
