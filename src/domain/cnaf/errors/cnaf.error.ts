export class CNAFError extends Error {
  constructor(readonly errorCode: number) {
    super();
  }
}
