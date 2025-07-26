import {User} from '../../models/user.model';

export interface AuthResponseDto {
  token: string;
  user:User;
}
