import { Field, ObjectType, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  accessToken: string;
}

@InputType()
export class ResetPasswordInput {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;

  @Field(type => String)
  resetToken: string;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field(type => String)
  status: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field(type => String)
  email: string;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field(type => String)
  status: string;
}