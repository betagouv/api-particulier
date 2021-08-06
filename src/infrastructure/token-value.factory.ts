import {createHash} from 'crypto';
import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {TokenValue} from 'src/domain/token-value';
import {UuidFactory} from 'src/domain/uuid.factory';

export class RandomTokenValueFactory implements TokenValueFactory {
  constructor(private readonly uuidFactory: UuidFactory) {}

  generateTokenValue() {
    return createHash('sha512')
      .update(this.uuidFactory.generateUuid())
      .digest('hex')
      .substr(0, 40) as TokenValue;
  }
}
