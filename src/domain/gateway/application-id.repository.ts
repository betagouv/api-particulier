import {ApplicationId} from 'src/domain/gateway/application-id';

export interface ApplicationIdRepository {
  findByTokenValue(tokenValue: string): Promise<ApplicationId>;
}
