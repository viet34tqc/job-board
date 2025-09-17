import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ResponseMessage } from 'src/core/interceptors/transformData.interceptor';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthUser } from './auth.type';
import { IsPublic, UserDecorator } from './decoratots/auth.decorator';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Auth')
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
  getProfile(@UserDecorator() user: AuthUser) {
    return user;
  }

  @Get('refresh-token')
  refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = req.cookies.refreshToken as string;
    return this.authService.refreshToken(token, response);
  }

  @Get('logout')
  @ResponseMessage('Logged out successfully')
  logout(
    @Res({ passthrough: true }) response: Response,
    @UserDecorator() user: UserDocument,
  ) {
    return this.authService.logout(response, user);
  }
}
