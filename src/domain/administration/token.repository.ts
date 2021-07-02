import {ApplicationId} from 'src/domain/application-id';

export interface TokenRepository {
  getApplicationIdByTokenValue(tokenValue: string): Promise<ApplicationId>;
}
