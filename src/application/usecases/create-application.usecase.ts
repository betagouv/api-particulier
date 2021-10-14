import {Application} from 'src/domain/application-management/entities/application';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationRepository} from 'src/domain/application-management/repositories/application-entity.repository';
import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {EventBus} from 'src/domain/event-bus';
import {UuidFactory} from 'src/infrastructure/uuid.factory';

export class CreateApplicationUsecase {
  constructor(
    private readonly uuidFactory: UuidFactory,
    private readonly tokenValueFactory: TokenValueFactory,
    private readonly applicationRepository: ApplicationRepository,
    private readonly eventBus: EventBus
  ) {}

  async createApplication(createApplicationDto: CreateApplicationDto) {
    const application = Application.create(
      createApplicationDto.name,
      createApplicationDto.dataPassId,
      createApplicationDto.subscriptions,
      createApplicationDto.scopes,
      createApplicationDto.userEmails,
      this.uuidFactory,
      this.tokenValueFactory
    );

    await this.applicationRepository.save(application);
    this.eventBus.publish(
      new ApplicationCreated(
        application.id,
        application.createdOn,
        application.name,
        application.dataPassId,
        createApplicationDto.scopes,
        createApplicationDto.subscriptions,
        application.userEmails,
        application.token.value
      )
    );

    return application;
  }
}
