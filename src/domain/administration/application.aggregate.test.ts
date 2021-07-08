import {Application} from 'src/domain/administration/application.aggregate';
import {ApplicationId} from 'src/domain/application-id';

describe('An application', () => {
  it('can generate new tokens', () => {
    const tokenFactory = {
      generateToken: jest.fn(),
    };

    const application = new Application(
      'croute' as ApplicationId,
      'yolo',
      new Date(),
      '4',
      []
    );
    const expectedApiKey = Symbol('ApiKey');
    const newToken = Symbol('Token');
    tokenFactory.generateToken.mockReturnValue([newToken, expectedApiKey]);
    const actualApiKey = application.generateNewToken(tokenFactory);

    expect(actualApiKey).toEqual(expectedApiKey);
    expect(application.tokens).toHaveLength(1);
  });
});
