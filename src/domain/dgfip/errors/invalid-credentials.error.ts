export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials provided to DGFIP data provider.');
  }
}
