export class CnafError extends Error {
  constructor(readonly errorCode: number) {
    super();
  }
}
