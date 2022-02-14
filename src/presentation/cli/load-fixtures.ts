import {Command} from 'commander';
import faker from 'faker';
import {fill} from 'lodash';
import {CreateApplicationUsecase} from 'src/application/usecases/create-application.usecase';
import {TokenValueFactory} from 'src/domain/application-management/token-value.factory';
import {UserEmail} from 'src/domain/application-management/user';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {Scope, unifiedScopesConfiguration} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {TokenValue} from 'src/domain/token-value';
import {
  applicationRepository,
  createApplicationUsecase,
  eventBus,
  uuidFactory,
} from 'src/infrastructure/service-container';

(async () => {
  faker.setLocale('fr');
  const program = new Command();
  program.version('0.0.1');
  program.parse(process.argv);

  const dataPassId = '0';
  const scopes = <Scope[]>Object.keys(unifiedScopesConfiguration);
  const subscriptions: Subscription[] = [
    'CNAF',
    'DGFIP',
    'MESRI',
    'POLE_EMPLOI',
  ];
  const userEmails = ['api-particulier@yopmail.com' as UserEmail];

  // Generate a new application working with an API key token
  const devApiKeyTokenValueFactory: TokenValueFactory = {
    generateTokenValue() {
      return 'dev-token' as TokenValue;
    },
  };
  const createApiKeyDevApplicationUseCase = new CreateApplicationUsecase(
    uuidFactory,
    devApiKeyTokenValueFactory,
    applicationRepository,
    eventBus
  );
  await createApiKeyDevApplicationUseCase.createApplication(
    new CreateApplicationDto(
      "Application de développement local appelable par clé d'API",
      dataPassId,
      scopes,
      userEmails
    )
  );

  // Generate a new application working with a FranceConnect token
  const devFranceConnectTokenValueFactory: TokenValueFactory = {
    generateTokenValue() {
      return '211286433e39cce01db448d80181bdfd005554b19cd51b3fe7943f6b3b86ab6e' as TokenValue; // see https://github.com/france-connect/service-provider-example/blob/master/config.js#L5
    },
  };
  const createFranceConnectDevApplicationUseCase = new CreateApplicationUsecase(
    uuidFactory,
    devFranceConnectTokenValueFactory,
    applicationRepository,
    eventBus
  );
  await createFranceConnectDevApplicationUseCase.createApplication(
    new CreateApplicationDto(
      'Application de développement local appelable par FranceConnect',
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
