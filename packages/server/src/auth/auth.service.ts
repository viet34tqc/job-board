import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { parseDuration } from 'src/core/libs/utils';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
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

  async login(
    loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Compare passwords
    const passwordMatches = await verify(user.password, loginDto.password);

    // If password incorrect throw exception
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthJwtPayload = {
      sub: user._id.toString(),
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

    // Update user's refreshToken
    await this.usersService.updateUserToken(user._id.toString(), refreshToken);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: parseDuration(
        this.configService.get<string>('jwtRefreshExpiresIn')!,
      ),
    });

    // Return user and token
    return {
      accessToken,
      user: payload,
    };
  }

  async refreshToken(
    token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const decodedToken = this.jwtService.verify<AuthJwtPayload>(token, {
        secret: this.configService.get<string>('jwtRefreshSecret')!,
      });
      const user = await this.usersService.findOneByEmail(decodedToken.email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      // Verify the token matches the refreshToken from cookie
      if (user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload: AuthJwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const [accessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('jwtRefreshSecret')!,
          expiresIn: this.configService.get<string>('jwtRefreshExpiresIn')!,
        }),
      ]);

      // Update user's newRefreshToken
      await this.usersService.updateUserToken(
        user._id.toString(),
        newRefreshToken,
      );

      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: parseDuration(
          this.configService.get<string>('jwtRefreshExpiresIn')!,
        ),
      });

      return {
        accessToken,
        user: payload,
      };
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Invalid refresh token',
      );
    }
  }

  async logout(
    @Res({ passthrough: true }) response: Response,
    user: UserDocument,
  ) {
    await this.usersService.updateUserToken(user._id.toString(), '');
    response.clearCookie('refreshToken');

    return '';
  }
}
