// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {ApplicationId} from 'src/domain/application-id';
import {Application} from 'src/domain/application-management/application.aggregate';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {UserEmail} from 'src/domain/application-management/user';
import {EventStore} from 'src/domain/event-store';
import {TokenValue} from 'src/domain/token-value';
import {EventSourcedApplicationRepository} from 'src/infrastructure/repositories/event-sourced-application.repository';

describe('The event-sourced application repository', () => {
  it('constructs applications from events', async () => {
    const eventStore = mock<EventStore>();
    const repository = new EventSourcedApplicationRepository(eventStore);

    const applicationId = 'croute' as ApplicationId;
    const userEmail = 'georges@moustaki.fr' as UserEmail;
    eventStore.listAggregateEvents.mockResolvedValue([
      new ApplicationCreated(
        applicationId,
        new Date(),
        'La croute',
        '4',
        [],
        [],
        [],
        'yolo' as TokenValue
      ),
      new UserSubscribed(applicationId, new Date(), userEmail),
    ]);

    const application = await repository.find(applicationId);

    expect(eventStore.listAggregateEvents).toHaveBeenCalledWith(
      Application.name,
      applicationId
    );
    expect(application.name).toEqual('La croute');
    expect(application.userEmails).toEqual([userEmail]);
  });
});
