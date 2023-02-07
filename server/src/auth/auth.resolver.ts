import { Resolver, Args, Mutation } from '@nestjs/graphql';
import {
  ForgotPasswordInput,
  ForgotPasswordResponse,
  ResetPasswordInput,
  ResetPasswordResponse,
} from 'src/auth/auth.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  // TODO login?

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