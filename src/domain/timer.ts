export class Timer {
  private startDate?: number;

  start(): void {
    this.startDate = new Date().getTime();
  }

  stop(): number {
    if (this.startDate === undefined) {
      throw new Error('Timer not started');
    }
    return new Date().getTime() - this.startDate;
  }
}
