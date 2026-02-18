import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth, GetUser } from 'src/core/decorators';
import { Response } from 'src/core/utils';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { message, ...session } = await this.authService.login(loginDto);
    return Response.success(session, message);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { message, ...user } = await this.authService.register(registerDto);
    return Response.success(user, message);
  }
  @Get('refresh')
  @Auth()
  async refreshToken(@GetUser() user: User) {
    const { message, ...session } = await this.authService.refreshToken(user);
    return Response.success(session);
  }
}
