import {Application} from 'src/domain/gateway/application.aggregate';
import {UserEmail} from 'src/domain/gateway/user';
import {TokenValue} from 'src/domain/gateway/token-value';

describe('An application', () => {
  const uuidFactory = {
    generateUuid() {
      return 'yolo';
    },
  };
  const tokenValueFactory = {
    generateTokenValue() {
      return 'croute' as TokenValue;
    },
  };

  it('creates a token upon application creation', () => {
    const application = Application.create(
      'yolo',
      '4',
      [],
      [],
      ['georges@moustaki.fr' as UserEmail],
      uuidFactory,
      tokenValueFactory
    );

    expect(application.tokenValue).toBeDefined();
  });

  it('can subscribe new users', () => {
    const newUser = 'jean@moust.fr' as UserEmail;

    const application = Application.create(
      'yolo',
      '4',
      [],
      [],
      ['georges@moustaki.fr' as UserEmail],
      uuidFactory,
      tokenValueFactory
    );

    application.subscribeUser(newUser);

    expect(application.userEmails).toHaveLength(2);
    expect(application.userEmails[1]).toEqual(newUser);
  });
});
