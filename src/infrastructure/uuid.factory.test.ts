import {UuidFactory} from 'src/infrastructure/uuid.factory';

describe('The uuid factory', () => {
  it('generates uuids', () => {
    const uuidFactory = new UuidFactory();

    const firstUuid = uuidFactory.generateUuid();
    const secondUuid = uuidFactory.generateUuid();

    expect(firstUuid).not.toEqual(secondUuid);
  });
});
