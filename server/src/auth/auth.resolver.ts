import { Resolver, Args, Mutation } from '@nestjs/graphql';
import {
  LoginInput,
  LoginResponse,
  ForgotPasswordInput,
  ForgotPasswordResponse,
  ResetPasswordInput,
  ResetPasswordResponse,
} from 'src/auth/auth.model';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { AccessToken } from 'src/common/decorators/access-token.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(returns => LoginResponse)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('input') loginData: LoginInput,
      @AccessToken() accessToken: string,
  ): Promise<LoginResponse> {
    return { accessToken };
  }

  @Mutation(returns => ForgotPasswordResponse)
  async forgotPassword(@Args('input') forgotPasswordData: ForgotPasswordInput): Promise<ForgotPasswordResponse>{
    const { email } = forgotPasswordData;
    const resetToken = this.authService.generateResetToken(email);
    // email user url with reset token query/path param include
    return { status: 'success' };
  }

  @Mutation(returns => ResetPasswordResponse)
  async resetPassword(@Args('input') resetPasswordData: ResetPasswordInput): Promise<ResetPasswordResponse>{
    // check if included reset token is in database for specified email AND that expiryTime has not passed
    const { email, password, resetToken } = resetPasswordData;
    const isValidResetToken = await this.authService.validateResetToken(email, resetToken);
    if (!isValidResetToken) {
      console.log(isValidResetToken, 'is not valid reset token');
    }
    // reset password here
    return { status: 'success' };
  }
}