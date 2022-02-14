export class NotFoundError extends Error {
  constructor() {
    super(
      "Impossible de trouver la situation de l'étudiant correspondant à la recherche"
    );
  }
}
