import {Pool} from 'pg';
import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/entities/application';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application-entity.repository';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {logFor} from 'src/domain/logger';
import {Scope} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';

export class PostgresApplicationRepository implements ApplicationRepository {
  private readonly logger = logFor(PostgresApplicationRepository.name);

  constructor(private readonly pg: Pool) {}

  async findById(id: ApplicationId): Promise<Application> {
    this.logger.log('debug', `Finding application "${id}"`);
    const query = `
      SELECT applications.*, tokens.scopes as scopes, tokens.subscriptions as subscriptions, tokens.value as token
      FROM applications
      JOIN tokens ON tokens.application_id = applications.id
      WHERE applications.id = $1`;
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
    this.logger.log('debug', 'Finding all applications');
    const query = `
      SELECT applications.*, tokens.scopes as scopes, tokens.subscriptions as subscriptions, tokens.value as token
      FROM applications
      JOIN tokens ON tokens.application_id = applications.id`;

    const result = await this.pg.query(query);

    const applications = result.rows.map(rawApplication =>
      this.deserialize(rawApplication)
    );

    this.logger.log('debug', `Found ${applications.length} applications`);

    return applications;
  }

  async findByTokenValue(tokenValue: TokenValue): Promise<Application> {
    this.logger.log('debug', `Finding application for token "${tokenValue}"`);
    const query = `
      SELECT applications.*, tokens.scopes as scopes, tokens.subscriptions as subscriptions, tokens.value as token
      FROM applications
      JOIN tokens ON tokens.application_id = applications.id
      WHERE tokens.value = $1`;
    const values = [tokenValue];

    const result = await this.pg.query(query, values);

    if (result.rowCount === 0) {
      throw new TokenNotFoundError(tokenValue);
    }

    const rawApplication = result.rows[0];

    const application = this.deserialize(rawApplication);

    this.logger.log(
      'debug',
      `Found application for token value "${tokenValue}"`,
      {application}
    );

    return application;
  }

  async findAllByUserEmail(userEmail: UserEmail): Promise<Application[]> {
    this.logger.log('debug', `Finding application for user "${userEmail}"`);
    const query = `
      SELECT applications.*, tokens.scopes as scopes, tokens.subscriptions as subscriptions, tokens.value as token
      FROM applications
      JOIN tokens ON tokens.application_id = applications.id
      WHERE user_emails ? $1`;
    const values = [userEmail];

    const result = await this.pg.query(query, values);

    const applications = result.rows.map(rawApplication =>
      this.deserialize(rawApplication)
    );

    this.logger.log('debug', `Found application for user "${userEmail}"`);

    return applications;
  }

  async save(application: Application): Promise<void> {
    this.logger.log('debug', `Saving application "${application.id}"`, {
      application,
    });
    try {
      await this.pg.query('BEGIN');

      const applicationQuery =
        'INSERT INTO applications(id, name, data_pass_id, user_emails, created_at) VALUES ($1, $2, $3, $4, $5)';
      const applicationValues = this.serializeApplication(application);
      await this.pg.query(applicationQuery, applicationValues);

      const tokenQuery =
        'INSERT INTO tokens(application_id, value, scopes, subscriptions) VALUES ($1, $2, $3, $4)';
      const tokenValues = this.serializeToken(application);
      await this.pg.query(tokenQuery, tokenValues);

      await this.pg.query('COMMIT');
    } catch (error) {
      await this.pg.query('ROLLBACK');
      throw error;
    }
    return;
  }

  async update(application: Application): Promise<void> {
    this.logger.log('debug', `Updating application "${application.id}"`, {
      application,
    });
    try {
      await this.pg.query('BEGIN');

      const applicationQuery =
        'UPDATE applications SET(name, data_pass_id, user_emails, created_at) = ($2, $3, $4, $5) WHERE id = $1';
      const applicationValues = this.serializeApplication(application);
      await this.pg.query(applicationQuery, applicationValues);

      const tokenQuery =
        'UPDATE tokens (value, scopes, subscriptions) = ($2, $3, $4) WHERE application_id = $1';
      const tokenValues = this.serializeToken(application);
      await this.pg.query(tokenQuery, tokenValues);

      await this.pg.query('COMMIT');
    } catch (error) {
      await this.pg.query('ROLLBACK');
      throw error;
    }
    return;
  }

  async remove(id: ApplicationId): Promise<void> {
    this.logger.log('debug', `Removing application "${id}"`);
    try {
      await this.pg.query('BEGIN');

      const values = [id];

      const tokenQuery = 'DELETE FROM tokens WHERE application_id = $1';
      await this.pg.query(tokenQuery, values);

      const applicationQuery = 'DELETE FROM applications WHERE id = $1';
      await this.pg.query(applicationQuery, values);

      await this.pg.query('COMMIT');
    } catch (error) {
      await this.pg.query('ROLLBACK');
      throw error;
    }
    return;
  }

  private serializeApplication(application: Application): unknown[] {
    return [
      application.id,
      application.name,
      application.dataPassId,
      JSON.stringify(application.userEmails),
      application.createdOn,
    ];
  }

  private serializeToken(application: Application): unknown[] {
    return [
      application.id,
      application.token.value,
      JSON.stringify(application.token.scopes),
      JSON.stringify(application.token.subscriptions),
    ];
  }

  private deserialize(rawApplication: {
    id: string;
    name: string;
    created_at: Date;
    data_pass_id: string;
    token: string;
    subscriptions: string[];
    user_emails: string[];
    scopes: string[];
  }) {
    return new Application(
      rawApplication.id as ApplicationId,
      rawApplication.name,
      rawApplication.created_at,
      rawApplication.data_pass_id,
      {
        scopes: rawApplication.scopes as Scope[],
        subscriptions: rawApplication.subscriptions as Subscription[],
        value: rawApplication.token as TokenValue,
      },
      rawApplication.user_emails as UserEmail[]
    );
  }
}
