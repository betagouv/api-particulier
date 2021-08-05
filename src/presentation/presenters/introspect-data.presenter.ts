import {ApplicationProjection} from 'src/domain/application-management/projections/application.projection';

export class IntrospectDataPresenter {
  presentData(introspectData: ApplicationProjection) {
    return {
      _id: introspectData.id,
      name: introspectData.name,
      scopes: introspectData.scopes,
    };
  }
}
