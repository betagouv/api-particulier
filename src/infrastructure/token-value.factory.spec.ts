import {expect} from 'chai';
import {RandomTokenValueFactory} from 'src/infrastructure/token-value.factory';
import {UuidFactory} from 'src/infrastructure/uuid.factory';

describe('The token value factory', () => {
  it('produces unique strings', () => {
    const uuidFactory = new UuidFactory();
    const factory = new RandomTokenValueFactory(uuidFactory);
    const value1 = factory.generateTokenValue();
    const value2 = factory.generateTokenValue();

    expect(value1).not.to.equal(value2);
  });
});
