import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'editor', 'commenter'])
  role: 'admin' | 'editor' | 'commenter';
}
