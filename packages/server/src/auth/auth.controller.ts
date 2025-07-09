import { Body, Controller, Get, Post, Request as Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { RequestWithUser } from './auth.type';
import { IsPublic } from './decoratots/auth.decorator';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @IsPublic()
  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
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
