import {expect} from 'chai';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {EventStore} from 'src/domain/event-store';
import {PostgresEventStore} from 'src/infrastructure/postgres.event-store';
import {ApplicationId} from 'src/domain/application-id';
import {UserEmail} from 'src/domain/application-management/user';
import {TokenValue} from 'src/domain/token-value';
import {pgPool} from 'test/integration/config';

describe('The postgres event store', () => {
  const eventStore: EventStore = new PostgresEventStore(pgPool);

  it('stores application events', async () => {
    const applicationCreated = new ApplicationCreated(
      '9d2b706c-7b3c-48ac-afdf-9d311533b656' as ApplicationId,
      new Date(),
      'Croute',
      '3',
      ['cnaf_adresse'],
      ['CNAF'],
      ['georges@moustaki.fr' as UserEmail],
      'token value' as TokenValue
    );

    expect(
      await eventStore.listAggregateEvents(
        'Application',
        applicationCreated.aggregateId
      )
    ).to.have.length(0);
    await eventStore.append(applicationCreated);
    const eventList = await eventStore.listAggregateEvents(
      'Application',
      applicationCreated.aggregateId
    );
    expect(eventList).to.have.length(1);
    expect(eventList[0]).to.be.an.instanceOf(ApplicationCreated);
  });
});
