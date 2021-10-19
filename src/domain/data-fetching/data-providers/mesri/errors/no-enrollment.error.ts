export class NoEnrollmentError extends Error {
  constructor() {
    super(
      'Inscriptions introuvables selon les autorisations accordées à votre application.'
    );
  }
}
