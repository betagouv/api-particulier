export class InvalidFormatError extends Error {
  constructor() {
    super('Data provider returned an invalid data format.');
  }
}
