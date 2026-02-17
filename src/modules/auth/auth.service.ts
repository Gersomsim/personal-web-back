import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
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
      // Regresamos una sesion
    } else {
      return {
        message:
          'User created successfully, you can login when approved by admin',
        user,
      };
    }
  }
}
