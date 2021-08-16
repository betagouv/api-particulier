import {ApplicationId} from 'src/domain/application-id';
import {ApplicationProjection} from 'src/domain/application-management/projections/application.projection';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenValue} from 'src/domain/token-value';

export interface ApplicationProjectionRepository {
  findAllByUserEmail(email: UserEmail): Promise<ApplicationProjection[]>;

  findAll(): Promise<ApplicationProjection[]>;

  findByTokenValue(tokenValue: TokenValue): Promise<ApplicationProjection>;

  findById(id: ApplicationId): Promise<ApplicationProjection>;

  save(applicationProjection: ApplicationProjection): Promise<void>;
}
