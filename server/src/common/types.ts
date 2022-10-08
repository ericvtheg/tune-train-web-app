import { UserPayload } from '../auth/auth.service';

// TODO remove this lol wtf
export interface IUserRequest extends Request {
  user: UserPayload;
}