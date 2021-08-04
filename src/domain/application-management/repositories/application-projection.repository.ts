import {ApplicationProjection} from 'src/domain/application-management/projections/application.projection';
import {TokenValue} from 'src/domain/token-value';

export interface ApplicationProjectionRepository {
  findByTokenValue(tokenValue: TokenValue): Promise<ApplicationProjection>;

  save(applicationProjection: ApplicationProjection): Promise<void>;
}
