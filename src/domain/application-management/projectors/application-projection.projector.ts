import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {ApplicationRemoved} from 'src/domain/application-management/events/application-removed.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {ApplicationProjection} from 'src/domain/application-management/projections/application.projection';
import {ApplicationProjectionRepository} from 'src/domain/application-management/repositories/application-projection.repository';

export class ApplicationProjector {
  constructor(
    private readonly applicationProjectionRepository: ApplicationProjectionRepository
  ) {}

  async onApplicationCreated(event: ApplicationCreated): Promise<void> {
    const applicationProjection = new ApplicationProjection(
      event.aggregateId as ApplicationId,
      event.name,
      event.userEmails,
      event.scopes,
      event.subscriptions,
      event.dataPassId,
      event.date,
      [event.tokenValue]
    );

    return this.applicationProjectionRepository.save(applicationProjection);
  }

  async onApplicationImported(event: ApplicationImported): Promise<void> {
    const applicationProjection = new ApplicationProjection(
      event.aggregateId as ApplicationId,
      event.name,
      event.userEmails,
      event.scopes,
      event.subscriptions,
      event.dataPassId,
      event.date,
      event.tokens.map(({value}) => value)
    );

    return this.applicationProjectionRepository.save(applicationProjection);
  }

  async onUserSubscribed(event: UserSubscribed): Promise<void> {
    const applicationProjection =
      await this.applicationProjectionRepository.findById(
        <ApplicationId>event.aggregateId
      );

    await this.applicationProjectionRepository.update({
      ...applicationProjection,
      userEmails: [...applicationProjection.userEmails, event.userEmail],
    });
    return;
  }

  async onApplicationRemoved(event: ApplicationRemoved): Promise<void> {
    await this.applicationProjectionRepository.remove(
      <ApplicationId>event.aggregateId
    );
    return;
  }
}
