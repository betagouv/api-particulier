// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {Application} from 'src/domain/gateway/application.aggregate';
import {ApplicationNotSubscribedError} from 'src/domain/gateway/errors/application-not-subscribed.error';
import {DGFIPDataProvider} from 'src/domain/gateway/dgfip/data-provider';
import {DGFIPInput, DGFIPOutput} from 'src/domain/gateway/dgfip/dto';
import {UserEmail} from 'src/domain/gateway/user';

describe('An application', () => {
  it('can generate new tokens', () => {
    const tokenFactory = {
      generateToken: jest.fn(),
    };

    const application = Application.create('yolo', '4', [], [], []);

    expect(application.getPendingEvents()).toHaveLength(1);
    const newToken = Symbol('Token');
    tokenFactory.generateToken.mockReturnValue(newToken);
    application.generateNewToken(tokenFactory);

    expect(application.tokens).toHaveLength(1);
  });

  it('can subscribe new users', () => {
    const newUser = 'jean@moust.fr' as UserEmail;

    const application = Application.create(
      'yolo',
      '4',
      [],
      [],
      ['georges@moustaki.fr' as UserEmail]
    );

    application.subscribeUser(newUser);

    expect(application.userEmails).toHaveLength(2);
    expect(application.userEmails[1]).toEqual(newUser);
  });

  describe('when called for DGFIP data', () => {
    it('throws an error if application is not subscribed to DGFIP data provider', async () => {
      const application = Application.create('croute', 'yolo', [], [], []);

      const useCase = async () =>
        await application.consumeDGFIP(
          mock<DGFIPInput>(),
          mock<DGFIPDataProvider>()
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    const application = Application.create(
      'croute',
      'yolo',
      ['DGFIP'],
      ['dgfip_avis_imposition'],
      []
    );

    it('calls the data provider and filters return data', async () => {
      const input: DGFIPInput = {
        taxNumber: '3',
        taxNoticeNumber: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      const dataProvider = mock<DGFIPDataProvider>();
      dataProvider.fetch.mockResolvedValue(
        unfilteredData as unknown as DGFIPOutput
      );

      const result = await application.consumeDGFIP(input, dataProvider);

      expect(result).toEqual({});
    });
  });
});
