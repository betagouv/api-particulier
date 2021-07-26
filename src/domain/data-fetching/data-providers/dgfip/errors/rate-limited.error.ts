export class RateLimitedError extends Error {
  constructor() {
    super('DGFIP error rate limit exceeded');
  }
}
