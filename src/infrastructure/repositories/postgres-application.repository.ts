import {Pool} from 'pg';
import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/entities/application.entity';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application-entity.repository';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {logFor} from 'src/domain/logger';
import {AnyScope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';

export class PostgresApplicationRepository implements ApplicationRepository {
  private readonly logger = logFor(PostgresApplicationRepository.name);

  constructor(private readonly pg: Pool) {}

  async findById(id: ApplicationId): Promise<Application> {
    this.logger.log('debug', `Finding application projection "${id}"`);
    const query = 'SELECT * FROM applications WHERE id = $1';
    const values = [id];

    const result = await this.pg.query(query, values);

    if (result.rowCount === 0) {
      throw new Error('Application not found');
    }

    const rawApplication = result.rows[0];
    const application = this.deserialize(rawApplication);

    return application;
  }

  async findAll(): Promise<Application[]> {
    this.logger.log('debug', 'Finding all application projections');
    const query = 'SELECT * FROM applications';

    const result = await this.pg.query(query);

    const applications = result.rows.map(rawApplication =>
      this.deserialize(rawApplication)
    );

    this.logger.log(
      'debug',
      `Found ${applications.length} application projections`
    );

    return applications;
  }

  async findByTokenValue(tokenValue: TokenValue): Promise<Application> {
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

    const application = this.deserialize(rawApplication);

    this.logger.log(
      'debug',
      `Found application projection for token value "${tokenValue}"`,
      {application}
    );

    return application;
  }

  async findAllByUserEmail(userEmail: UserEmail): Promise<Application[]> {
    this.logger.log(
      'debug',
      `Finding application projections for user "${userEmail}"`
    );
    const query = 'SELECT * FROM applications WHERE user_emails ? $1';
    const values = [userEmail];

    const result = await this.pg.query(query, values);

    const applications = result.rows.map(rawApplication =>
      this.deserialize(rawApplication)
    );

    this.logger.log(
      'debug',
      `Found application projections for user "${userEmail}"`
    );

    return applications;
  }

  async save(application: Application): Promise<void> {
    this.logger.log('debug', `Saving application "${application.id}"`, {
      applicationProjection: application,
    });
    const query =
      'INSERT INTO applications(id, name, scopes, subscriptions, data_pass_id, user_emails, created_at, tokens) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = this.serialize(application);

    await this.pg.query(query, values);
    return;
  }

  async update(application: Application): Promise<void> {
    this.logger.log('debug', `Updating application "${application.id}"`, {
      applicationProjection: application,
    });
    const query =
      'UPDATE applications SET (name, scopes, subscriptions, data_pass_id, user_emails, created_at, tokens) = ($2, $3, $4, $5, $6, $7, $8) WHERE id = $1';
    const values = this.serialize(application);

    await this.pg.query(query, values);
    return;
  }

  async remove(id: ApplicationId): Promise<void> {
    this.logger.log('debug', `Removing application projection "${id}"`);
    const query = 'DELETE FROM applications WHERE id = $1';
    const values = [id];

    await this.pg.query(query, values);
    return;
  }

  private serialize(application: Application): unknown[] {
    return [
      application.id,
      application.name,
      JSON.stringify(application.scopes),
      JSON.stringify(application.subscriptions),
      application.dataPassId,
      JSON.stringify(application.userEmails),
      application.createdOn,
      JSON.stringify(application.tokens),
    ];
  }

  private deserialize(rawApplication: {
    id: string;
    name: string;
    created_at: Date;
    data_pass_id: string;
    tokens: string[];
    subscriptions: string[];
    user_emails: string[];
    scopes: string[];
  }) {
    return new Application(
      rawApplication.id as ApplicationId,
      rawApplication.name,
      rawApplication.created_at,
      rawApplication.data_pass_id,
      rawApplication.tokens as TokenValue[],
      rawApplication.subscriptions as Subscription[],
      rawApplication.user_emails as UserEmail[],
      rawApplication.scopes as AnyScope[]
    );
  }
}
