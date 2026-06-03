import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

class LoginDto {
  email: string;
  password: string;
  cooperativeId: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
      loginDto.cooperativeId,
    );
  }

  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@Req() req: any) {
    return req.session;
  }
}
