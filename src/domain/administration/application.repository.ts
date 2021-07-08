import {ApplicationId} from 'src/domain/administration/application-id';

export interface ApplicationRepository {
  getApplicationIdByTokenValue(tokenValue: string): Promise<ApplicationId>;
}
