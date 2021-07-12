// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
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
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {EventBus} from 'src/domain/event-bus';
import {TokenValue} from 'src/domain/token-value';

describe('The data provider client', () => {
  const cnafDataProvider = mock<CnafDataProvider>();
  const dgfipDataProvider = mock<DgfipDataProvider>();
  const eventBus = mock<EventBus>();
  const dataProviderClient = new DataProviderClient(
    cnafDataProvider,
    dgfipDataProvider,
    eventBus
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
          mock<DgfipInput>(),
          noSubscriptionToken,
          '/croute'
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    it('calls the data provider and filters return data', async () => {
      const input: DgfipInput = {
        taxNumber: '3',
        taxNoticeNumber: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      dgfipDataProvider.fetch.mockResolvedValue(
        unfilteredData as unknown as DgfipOutput
      );

      const result = await dataProviderClient.consumeDgfip(
        input,
        dgfipToken,
        '/croute'
      );

      expect(result).toEqual({});
    });
  });

  describe('when called for CNAF data', () => {
    it('throws an error if application is not subscribed to CNAF data provider', async () => {
      const useCase = async () =>
        await dataProviderClient.consumeCnaf(
          mock<CnafInput>(),
          noSubscriptionToken,
          '/croute'
        );

      expect(useCase).rejects.toBeInstanceOf(ApplicationNotSubscribedError);
    });

    it('calls the data provider and filters return data', async () => {
      const input: CnafInput = {
        codePostal: '3',
        numeroAllocataire: '4',
      };

      const unfilteredData = Symbol('unfiltered data');
      cnafDataProvider.fetch.mockResolvedValue(
        unfilteredData as unknown as CnafOutput
      );

      const result = await dataProviderClient.consumeCnaf(
        input,
        cnafToken,
        '/croute'
      );

      expect(result).toEqual({});
    });
  });

  it('logs 500 error when internal error occurs', async () => {
    const input: CnafInput = {
      codePostal: '3',
      numeroAllocataire: '4',
    };
    cnafDataProvider.fetch.mockRejectedValue(
      new Error('Cannot read property croute of undefined')
    );

    try {
      await dataProviderClient.consumeCnaf(input, cnafToken, '/croute').catch();
      // eslint-disable-next-line no-empty
    } catch {}

    expect(eventBus.publish).toHaveBeenCalled();
    expect(
      (eventBus.publish.mock.calls[0][0] as TokenConsumed).statusCode
    ).toEqual(500);
  });

  it('logs a 403 when application is not subscribed to data provider', async () => {
    const input = mock<CnafInput>();
    try {
      await dataProviderClient
        .consumeCnaf(input, dgfipToken, '/croute')
        .catch();
      // eslint-disable-next-line no-empty
    } catch {}

    expect(eventBus.publish).toHaveBeenCalled();
    expect(
      (eventBus.publish.mock.calls[0][0] as TokenConsumed).statusCode
    ).toEqual(403);
  });
});
