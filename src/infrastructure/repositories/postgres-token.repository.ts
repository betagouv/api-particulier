import {Pool} from 'pg';
import {ApplicationId} from 'src/domain/application-id';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token, UnsavedToken} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {logFor} from 'src/domain/logger';
import {TokenValue} from 'src/domain/token-value';

export class PostgresTokenRepository implements TokenRepository {
  private readonly logger = logFor(PostgresTokenRepository.name);

  constructor(private readonly pg: Pool) {}

  async findByTokenValue(tokenValue: TokenValue): Promise<Token> {
    this.logger.log('debug', `Finding token "${tokenValue}"`);
    const query = `
      SELECT tokens.*, applications.name as application_name
      FROM tokens
      JOIN applications ON applications.id = tokens.application_id
      WHERE value = $1`;
    const values = [tokenValue];

    const result = await this.pg.query(query, values);

    if (result.rowCount === 0) {
      throw new TokenNotFoundError(tokenValue);
    }
    const rawToken = result.rows[0];

    const token = new Token(
      rawToken.id,
      {
        id: rawToken.application_id,
        name: rawToken.application_name,
      },
      rawToken.value,
      rawToken.scopes,
      rawToken.subscriptions
    );
    this.logger.log('debug', `Found token for value "${tokenValue}"`, {token});

    return token;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async save(token: UnsavedToken): Promise<void> {
    // No-op, token is already saved by the application postgres repository
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeByApplicationId(id: ApplicationId): Promise<void> {
    // No-op, token is already removed by the application postgres repository
  }
}
