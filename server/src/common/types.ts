import { UserPayload } from '../auth/auth.service';

export interface IUserRequest extends Request {
  user: UserPayload;
}