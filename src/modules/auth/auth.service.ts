import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userEmail = await this.userService.findOneByEmail(registerDto.email);
    if (userEmail) {
      throw new BadRequestException('User already exists');
    }
    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: passwordHash,
    });
    if (user.role === 'commenter') {
      return {
        message:
          'User created successfully, you can login when approved by admin',
        user,
        token: this.generateToken(user.id),
      };
    } else {
      return {
        message:
          'User created successfully, you can login when approved by admin',
        user,
      };
    }
  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    const { password, ...rest } = user;
    return {
      message: 'User logged in successfully',
      user: rest,
      token: this.generateToken(user.id),
    };
  }
  refreshToken(user: User) {
    const { password, ...rest } = user;
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    return {
      message: 'User logged in successfully',
      user: rest,
      token: this.generateToken(user.id),
    };
  }

  private generateToken(id: string): string {
    const payload: JwtPayload = {
      id,
      type: 'access',
    };
    return this.jwtService.sign(payload);
  }
}
