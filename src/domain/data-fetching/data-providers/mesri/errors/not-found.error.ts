import {MesriId} from 'src/domain/data-fetching/data-providers/mesri/dto';

export class NotFoundError extends Error {
  constructor(ine: MesriId) {
    super(
      `Impossible de trouver la situation de l'étudiant correspondant à l'identifiant ${ine}`
    );
  }
}
