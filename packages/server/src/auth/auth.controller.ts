import {
  Body,
  Controller,
  Get,
  Post,
  Request as Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { AuthService } from './auth.service';
import { RequestWithUser } from './auth.type';
import { IsPublic } from './decoratots/auth.decorator';
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
  getProfile(@Req() req: RequestWithUser) {
    return {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    };
  }
}
