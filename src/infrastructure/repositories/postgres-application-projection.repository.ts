import {Pool} from 'pg';
import {ApplicationProjection} from 'src/domain/application-management/projections/application.projection';
import {ApplicationProjectionRepository} from 'src/domain/application-management/repositories/application-projection.repository';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {logFor} from 'src/domain/logger';
import {AnyScope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';

export class PostgresApplicationProjectionRepository
  implements ApplicationProjectionRepository
{
  private readonly logger = logFor(
    PostgresApplicationProjectionRepository.name
  );

  constructor(private readonly pg: Pool) {}

  async findByTokenValue(
    tokenValue: TokenValue
  ): Promise<ApplicationProjection> {
    this.logger.log(
      'debug',
      `Finding application projection for token "${tokenValue}"`
    );
    const query =
      'SELECT * FROM applications JOIN tokens ON tokens.application_id = applications.id WHERE tokens.value = $1';
    const values = [tokenValue];

    const result = await this.pg.query(query, values);

    if (result.rowCount === 0) {
      throw new TokenNotFoundError(tokenValue);
    }

    const rawApplication = result.rows[0];

    const application = new ApplicationProjection(
      rawApplication.id,
      rawApplication.name,
      rawApplication.user_emails as UserEmail[],
      rawApplication.scopes as AnyScope[],
      rawApplication.subscriptions as Subscription[],
      rawApplication.data_pass_id,
      rawApplication.created_at,
      rawApplication.tokens
    );

    this.logger.log(
      'debug',
      `Found application projection for token value "${tokenValue}"`,
      {application}
    );

    return application;
  }

  async findAllByUserEmail(
    userEmail: UserEmail
  ): Promise<ApplicationProjection[]> {
    this.logger.log(
      'debug',
      `Finding application projections for user "${userEmail}"`
    );
    const query = 'SELECT * FROM applications WHERE user_emails ? $1';
    const values = [userEmail];

    const result = await this.pg.query(query, values);

    const applications = result.rows.map(
      rawApplication =>
        new ApplicationProjection(
          rawApplication.id,
          rawApplication.name,
          rawApplication.user_emails as UserEmail[],
          rawApplication.scopes as AnyScope[],
          rawApplication.subscriptions as Subscription[],
          rawApplication.data_pass_id,
          rawApplication.created_at,
          rawApplication.tokens
        )
    );

    this.logger.log(
      'debug',
      `Found application projections for user "${userEmail}"`
    );

    return applications;
  }

  async save(applicationProjection: ApplicationProjection): Promise<void> {
    this.logger.log(
      'debug',
      `Saving application projection "${applicationProjection.id}"`,
      {applicationProjection}
    );
    const query =
      'INSERT INTO applications(id, name, scopes, subscriptions, data_pass_id, user_emails, created_at, tokens) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [
      applicationProjection.id,
      applicationProjection.name,
      JSON.stringify(applicationProjection.scopes),
      JSON.stringify(applicationProjection.subscriptions),
      applicationProjection.dataPassId,
      JSON.stringify(applicationProjection.userEmails),
      applicationProjection.createdAt,
      JSON.stringify(applicationProjection.tokens),
    ];

    await this.pg.query(query, values);
    return;
  }
}
