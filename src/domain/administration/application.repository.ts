import {ApplicationId} from 'src/domain/application-id';

export interface ApplicationRepository {
  getApplicationIdByTokenValue(tokenValue: string): Promise<ApplicationId>;
}
