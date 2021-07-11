import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/gateway/application.aggregate';

export interface ApplicationRepository {
  find(id: ApplicationId): Promise<Application>;
}
