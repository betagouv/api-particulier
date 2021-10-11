import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/entities/application.entity';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenValue} from 'src/domain/token-value';

export interface ApplicationRepository {
  findAllByUserEmail(email: UserEmail): Promise<Application[]>;

  findAll(): Promise<Application[]>;

  findByTokenValue(tokenValue: TokenValue): Promise<Application>;

  findById(id: ApplicationId): Promise<Application>;

  save(application: Application): Promise<void>;

  update(application: Application): Promise<void>;

  remove(id: ApplicationId): Promise<void>;
}
