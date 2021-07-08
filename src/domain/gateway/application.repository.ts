import {ApplicationId} from 'src/domain/gateway/application-id';

export interface ApplicationRepository {
  getApplicationIdByTokenValue(tokenValue: string): Promise<ApplicationId>;
}
