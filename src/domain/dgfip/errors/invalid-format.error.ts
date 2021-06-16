export class InvalidFormatError extends Error {
  constructor() {
    super('DGFIP returned an invalid data format.');
  }
}
