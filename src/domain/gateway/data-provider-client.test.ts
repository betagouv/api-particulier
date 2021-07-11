// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {ApplicationId} from 'src/domain/gateway/application-id';
import {DataProviderClient} from 'src/domain/gateway/data-provider-client';
import {CNAFDataProvider} from 'src/domain/gateway/data-providers/cnaf/data-provider';
import {
  CNAFInput,
  CNAFOutput,
} from 'src/domain/gateway/data-providers/cnaf/dto';
import {DGFIPDataProvider} from 'src/domain/gateway/data-providers/dgfip/data-provider';
import {
  DGFIPInput,
  DGFIPOutput,
} from 'src/domain/gateway/data-providers/dgfip/dto';
import {ApplicationNotSubscribedError} from 'src/domain/gateway/errors/application-not-subscribed.error';
import {Token} from 'src/domain/gateway/projections/token';
import {TokenValue} from 'src/domain/gateway/token-value';

describe('The data provider client', () => {
  const cnafDataProvider = mock<CNAFDataProvider>();
  const dgfipDataProvider = mock<DGFIPDataProvider>();
  const dataProviderClient = new DataProviderClient(
    cnafDataProvider,
    dgfipDataProvider
  );

  const noSubscriptionToken = new Token(
    'croute' as ApplicationId,
    'tokenValue' as TokenValue,
    [],
    []
  );
  const dgfipToken = new Token(
    'croute' as ApplicationId,
    'tokenValue' as TokenValue,
    ['dgfip_avis_imposition'],
    ['DGFIP']
  );
  const cnafToken = new Token(
    'croute' as ApplicationId,
    'tokenValue' as TokenValue,
    ['cnaf_adresse'],
    ['CNAF']
  );

  describe('when called for DGFIP data', () => {
    it('throws an error if application is not subscribed to DGFIP data provider', async () => {
      const useCase = async () =>
        await dataProviderClient.consumeDGFIP(
          mock<DGFIPInput>(),
          noSubscriptionToken
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    it('calls the data provider and filters return data', async () => {
      const input: DGFIPInput = {
        taxNumber: '3',
        taxNoticeNumber: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      dgfipDataProvider.fetch.mockResolvedValue(
        unfilteredData as unknown as DGFIPOutput
      );

      const result = await dataProviderClient.consumeDGFIP(input, dgfipToken);

      expect(result).toEqual({});
    });
  });

  describe('when called for CNAF data', () => {
    it('throws an error if application is not subscribed to CNAF data provider', async () => {
      const useCase = async () =>
        await dataProviderClient.consumeCNAF(
          mock<CNAFInput>(),
          noSubscriptionToken
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    it('calls the data provider and filters return data', async () => {
      const input: CNAFInput = {
        codePostal: '3',
        numeroAllocataire: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      cnafDataProvider.fetch.mockResolvedValue(
        unfilteredData as unknown as CNAFOutput
      );

      const result = await dataProviderClient.consumeCNAF(input, cnafToken);

      expect(result).toEqual({});
    });
  });
});
