import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify(@Req() req, @Res({ passthrough: true }) res) {
    res.header('X-User-Id', req.user.userId);
    res.header('X-User-Email', req.user.email);
    return req.user;
  }
}
