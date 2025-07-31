import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './auth.type';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async signup(registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  async login(loginDto: LoginDTO) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) throw new ForbiddenException('Invalid credentials');

    // Compare passwords
    const passwordMatches = await verify(user.password, loginDto.password);

    // If password incorrect throw exception
    if (!passwordMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload: AuthJwtPayload = {
      sub: user._id as string,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Generate JWT tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwtRefreshSecret')!,
        expiresIn: this.configService.get<string>('jwtRefreshExpiresIn')!,
      }),
    ]);

    // Return user and token
    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  }
}
