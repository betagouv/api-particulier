import {ApplicationTransactionManager} from 'src/domain/application-management/application-transaction-manager';
import {Application} from 'src/domain/application-management/application.aggregate';
import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {UuidFactory} from 'src/infrastructure/uuid.factory';

export class CreateApplicationUsecase {
  constructor(
    private readonly applicationTransactionManager: ApplicationTransactionManager,
    private readonly uuidFactory: UuidFactory,
    private readonly tokenValueFactory: TokenValueFactory
  ) {}

  async createApplication(createApplicationDto: CreateApplicationDto) {
    const application = await this.applicationTransactionManager.applyToNew(
      () => {
        const application = Application.create(
          createApplicationDto.name,
          createApplicationDto.dataPassId,
          createApplicationDto.subscriptions,
          createApplicationDto.scopes,
          createApplicationDto.userEmails,
          this.uuidFactory,
          this.tokenValueFactory
        );

        return application;
      }
    );
    return application;
  }
}
