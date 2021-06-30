import {DGFIPInput, DGFIPOutput} from './dgfip/dto';
import {Application, ApplicationId} from './application.aggregate';
// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {DGFIPDataProvider} from './dgfip/data-provider';
import {ApplicationNotSubscribedError} from './errors/application-not-subscribed.error';

describe('The application aggregate', () => {
  describe('when called for DGFIP data', () => {
    it('throws an error if application is not subscribed to DGFIP data provider', async () => {
      const application = new Application(
        'croute' as ApplicationId,
        'Yolo',
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

    const application = new Application(
      'croute' as ApplicationId,
      'Yolo',
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
