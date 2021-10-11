import {Application} from 'src/domain/application-management/entities/application.entity';

export class IntrospectDataPresenter {
  presentData(introspectData: Application) {
    return {
      _id: introspectData.id,
      name: introspectData.name,
      scopes: introspectData.scopes,
    };
  }
}
