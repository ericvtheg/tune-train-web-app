import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService, UserPayload, IJWTResponse } from './auth.service';
import { IUserRequest } from '../common/types';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: IUserRequest): Promise<IJWTResponse> {
    // TODO do not log access token
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: IUserRequest): UserPayload {
    return req.user;
  }
}
