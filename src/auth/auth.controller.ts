import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async Register(@Body() userInfo: any) {
    console.log('Registering user with data:', userInfo);
    return this.authService.Register(userInfo);
  }

  @Public()
  @Post('login')
  SignIn(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { username, password } = LoginDto;
    return this.authService.signIn(username, password, res);
  }

  @Get('logout')
  async logout(@Req() req: Request) {
    const user = req['user'];
    const accessToken = req['accessToken'];
    await this.authService.logout(user, accessToken);
    return { message: 'Logout successful' };
  }

  @Get('/me')
  async getMe(@Req() req: Request) {
    const user = req['user'];
    return await this.authService.getMe(user.sub);
  }
}
