import {Pool} from 'pg';
import {ApplicationId} from 'src/domain/application-id';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {logFor} from 'src/domain/logger';
import {TokenValue} from 'src/domain/token-value';

export class PostgresTokenRepository implements TokenRepository {
  private readonly logger = logFor(PostgresTokenRepository.name);

  constructor(private readonly pg: Pool) {}

  async findByTokenValue(tokenValue: TokenValue): Promise<Token> {
    this.logger.log('debug', `Finding token "${tokenValue}"`);
    const query = 'SELECT * FROM tokens WHERE value = $1';
    const values = [tokenValue];

    const result = await this.pg.query(query, values);

    if (result.rowCount === 0) {
      throw new TokenNotFoundError(tokenValue);
    }
    const rawToken = result.rows[0];

    const token = new Token(
      rawToken.application_id,
      rawToken.value,
      rawToken.scopes,
      rawToken.subscriptions
    );
    this.logger.log('debug', `Found token for value "${tokenValue}"`, {token});

    return token;
  }

  async save(token: Token): Promise<void> {
    this.logger.log('debug', `Saving token "${token.value}"`, {token});
    const query =
      'INSERT INTO tokens(application_id, value, scopes, subscriptions) VALUES ($1, $2, $3, $4)';
    const values = [
      token.applicationId,
      token.value,
      JSON.stringify(token.scopes),
      JSON.stringify(token.subscriptions),
    ];

    await this.pg.query(query, values);
    return;
  }

  async removeByApplicationId(id: ApplicationId): Promise<void> {
    this.logger.log('debug', `Removing tokens for application "${id}"`);
    const query = 'DELETE FROM tokens WHERE application_id = $1';
    const values = [id];

    await this.pg.query(query, values);
    return;
  }
}
