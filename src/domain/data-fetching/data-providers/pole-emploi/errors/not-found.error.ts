import {PoleEmploiId} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';

export class NotFound extends Error {
  constructor(id: PoleEmploiId) {
    super(
      `Impossible de trouver la situation pôle emploi correspondant à l'identifiant ${id}`
    );
  }
}
