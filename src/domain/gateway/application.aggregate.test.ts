// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {Application} from 'src/domain/gateway/application.aggregate';
import {ApplicationNotSubscribedError} from 'src/domain/gateway/errors/application-not-subscribed.error';
import {ApplicationId} from 'src/domain/gateway/application-id';
import {DGFIPDataProvider} from 'src/domain/gateway/dgfip/data-provider';
import {DGFIPInput, DGFIPOutput} from 'src/domain/gateway/dgfip/dto';

describe('An application', () => {
  it('can generate new tokens', () => {
    const tokenFactory = {
      generateToken: jest.fn(),
    };

    const application = Application.create('yolo', '4', [], []);
    const expectedApiKey = Symbol('ApiKey');
    const newToken = Symbol('Token');
    tokenFactory.generateToken.mockReturnValue([newToken, expectedApiKey]);
    const actualApiKey = application.generateNewToken(tokenFactory);

    expect(actualApiKey).toEqual(expectedApiKey);
    expect(application.tokens).toHaveLength(1);
  });

  describe('when called for DGFIP data', () => {
    it('throws an error if application is not subscribed to DGFIP data provider', async () => {
      const application = Application.create(
        'croute' as ApplicationId,
        'yolo',
        [],
        []
      );

      const useCase = async () =>
        await application.consumeDGFIP(
          mock<DGFIPInput>(),
          mock<DGFIPDataProvider>()
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    const application = Application.create(
      'croute' as ApplicationId,
      'yolo',
      ['DGFIP'],
      ['dgfip_avis_imposition']
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
