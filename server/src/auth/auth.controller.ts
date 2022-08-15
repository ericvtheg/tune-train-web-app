import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService, UserPayload, IJWTResponse } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IUserRequest } from '../common/types';

@Controller()
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: IUserRequest): Promise<IJWTResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: IUserRequest): UserPayload {
    return req.user;
  }
}
