import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDTO) {
    // Find user by email
    const user = await this.usersService.findOne(loginDto.email);

    // Compare passwords
    const passwordMatches = await verify(user.password, loginDto.password);

    // If password incorrect throw exception
    if (!passwordMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload = {
      sub: user._id as string,
      email: user.email,
    };

    // Generate JWT token
    const token = await this.jwtService.signAsync(payload);

    // Return user and token
    return {
      accessToken: token,
    };
  }
}
