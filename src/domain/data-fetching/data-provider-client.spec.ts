// eslint-disable-next-line node/no-unpublished-import
import * as sinon from 'ts-sinon';
// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {ApplicationId} from 'src/domain/application-id';
import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {CnafDataProvider} from 'src/domain/data-fetching/data-providers/cnaf/data-provider';
import {
  CnafInput,
  CnafOutput,
} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {DgfipDataProvider} from 'src/domain/data-fetching/data-providers/dgfip/data-provider';
import {
  DgfipInput,
  DgfipOutput,
} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenValue} from 'src/domain/token-value';

describe('The data provider client', () => {
  const cnafDataProvider = sinon.stubInterface<CnafDataProvider>();
  const dgfipDataProvider = sinon.stubInterface<DgfipDataProvider>();
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
        await dataProviderClient.consumeDgfip(
          sinon.stubInterface<DgfipInput>(),
          noSubscriptionToken,
          '/croute'
        );

      expect(useCase()).to.be.rejectedWith(ApplicationNotSubscribedError);
    });

    it('calls the data provider and filters return data', async () => {
      const input: DgfipInput = {
        taxNumber: '3',
        taxNoticeNumber: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      dgfipDataProvider.fetch.resolves(
        unfilteredData as unknown as DgfipOutput
      );

      const result = await dataProviderClient.consumeDgfip(
        input,
        dgfipToken,
        '/croute'
      );

      expect(result).to.deep.equal({});
    });
  });

  describe('when called for CNAF data', () => {
    it('throws an error if application is not subscribed to CNAF data provider', async () => {
      const useCase = async () =>
        await dataProviderClient.consumeCnaf(
          sinon.stubInterface<CnafInput>(),
          noSubscriptionToken,
          '/croute'
        );

      expect(useCase()).to.be.rejectedWith(ApplicationNotSubscribedError);
    });

    it('calls the data provider and filters return data', async () => {
      const input: CnafInput = {
        codePostal: '3',
        numeroAllocataire: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      cnafDataProvider.fetch.resolves(unfilteredData as unknown as CnafOutput);

      const result = await dataProviderClient.consumeCnaf(
        input,
        cnafToken,
        '/croute'
      );

      expect(result).to.deep.equal({});
    });
  });
});
