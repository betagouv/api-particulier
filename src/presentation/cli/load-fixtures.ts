import {Command} from 'commander';
import faker from 'faker';
import {fill} from 'lodash';
import {UserEmail} from 'src/domain/application-management/user';
import {CreateApplicationDto} from 'src/domain/data-fetching/dtos/create-application.dto';
import {AnyScope, unifiedScopesConfiguration} from 'src/domain/scopes';
import {Subscription} from 'src/domain/subscription';
import {createApplicationUsecase} from 'src/infrastructure/service-container';

(async () => {
  faker.setLocale('fr');
  const program = new Command();
  program.version('0.0.1');
  program.parse(process.argv);

  await Promise.all(
    fill(Array(10), null).map(() => {
      const applicationName = `Commune de ${faker.address.cityName()}`;
      const dataPassId = '0';
      const scopes = <AnyScope[]>Object.keys(unifiedScopesConfiguration);
      const subscriptions: Subscription[] = [
        'CNAF',
        'DGFIP',
        'MESRI',
        'POLE_EMPLOI',
      ];

      const createApplicationDto: CreateApplicationDto = {
        dataPassId,
        name: applicationName,
        scopes,
        subscriptions,
        userEmails: ['api-particulier@yopmail.com' as UserEmail],
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
