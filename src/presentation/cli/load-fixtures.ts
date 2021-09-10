import {Command} from 'commander';
import faker from 'faker';
import {fill} from 'lodash';
import {CreateApplicationUsecase} from 'src/application/usecases/create-application.usecase';
import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {UserEmail} from 'src/domain/application-management/user';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {AnyScope, unifiedScopesConfiguration} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';
import {
  applicationTransactionManager,
  createApplicationUsecase,
  uuidFactory,
} from 'src/infrastructure/service-container';

(async () => {
  faker.setLocale('fr');
  const program = new Command();
  program.version('0.0.1');
  program.parse(process.argv);

  const dataPassId = '0';
  const scopes = <AnyScope[]>Object.keys(unifiedScopesConfiguration);
  const subscriptions: Subscription[] = [
    'CNAF',
    'DGFIP',
    'MESRI',
    'POLE_EMPLOI',
  ];
  const userEmails = ['api-particulier@yopmail.com' as UserEmail];
  const devTokenValueFactory: TokenValueFactory = {
    generateTokenValue() {
      return 'dev-token' as TokenValue;
    },
  };
  const createDevApplicationUseCase = new CreateApplicationUsecase(
    applicationTransactionManager,
    uuidFactory,
    devTokenValueFactory
  );
  await createDevApplicationUseCase.createApplication(
    new CreateApplicationDto(
      'Application de développement local',
      dataPassId,
      scopes,
      userEmails
    )
  );
  await Promise.all(
    fill(Array(10), null).map(() => {
      const applicationName = `Commune de ${faker.address.cityName()}`;

      const createApplicationDto: CreateApplicationDto = {
        dataPassId,
        name: applicationName,
        scopes,
        subscriptions,
        userEmails,
      };

      console.log(`Creating application ${applicationName}`);
      return createApplicationUsecase.createApplication(createApplicationDto);
    })
  );

  setTimeout(async () => {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }, 3000);
})();
