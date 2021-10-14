import {expect} from 'chai';
import {Application} from 'src/domain/application-management/entities/application';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenValue} from 'src/domain/token-value';

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

  const application = Application.create(
    'yolo',
    '4',
    [],
    [],
    ['georges@moustaki.fr' as UserEmail],
    uuidFactory,
    tokenValueFactory
  );

  it('creates a token upon application creation', () => {
    expect(application.token).to.exist;
  });

  it('can subscribe new users', () => {
    const newUser = 'jean@moust.fr' as UserEmail;

    application.subscribeUser(newUser);

    expect(application.userEmails).to.have.length(2);
    expect(application.userEmails[1]).to.deep.equal(newUser);
  });
});
