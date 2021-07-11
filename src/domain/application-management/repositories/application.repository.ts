import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/application.aggregate';

export interface ApplicationRepository {
  find(id: ApplicationId): Promise<Application>;
}
