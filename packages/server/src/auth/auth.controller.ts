import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseMessage } from 'src/interceptors/transformData.interceptor';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { IsPublic, UserDecorator } from './decoratots/auth.decorator';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @Post('signup')
  async signup(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signup(registerUserDto);
  }

  @IsPublic()
  @Post('login')
  login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response);
  }

  @Get('me')
  @ResponseMessage('Get user profile successfully')
  getProfile(@UserDecorator() user: User) {
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
