import {Client} from 'pg';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';

export class PostgresRepository implements TokenRepository {
  constructor(private readonly pg: Client) {}

  async findByTokenValue(tokenValue: TokenValue): Promise<Token> {
    const query = 'SELECT * FROM tokens WHERE value = $1';
    const values = [tokenValue];

    const result = await this.pg.query(query, values);

    if (result.rowCount === 0) {
      throw new TokenNotFoundError(tokenValue);
    }
    const rawToken = result.rows[0];

    return new Token(
      rawToken.application_id,
      rawToken.value,
      rawToken.scopes,
      rawToken.subscriptions
    );
  }

  async save(token: Token): Promise<void> {
    const query =
      'INSERT INTO tokens(application_id, value, scopes, subscriptions) VALUES ($1, $2, $3, $4)';
    const values = [
      token.applicationId,
      token.value,
      token.scopes,
      token.subscriptions,
    ];

    await this.pg.query(query, values);
    return;
  }
}
