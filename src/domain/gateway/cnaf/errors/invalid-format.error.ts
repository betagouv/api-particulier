export class InvalidFormatError extends Error {
  constructor() {
    super('CNAF returned an invalid data format.');
  }
}
