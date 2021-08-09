import {UserEmail} from 'src/domain/application-management/user';

declare global {
  namespace Express {
    interface User {
      email: UserEmail;
    }
  }
}
