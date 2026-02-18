import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
