import {Timer} from 'src/domain/timer';

describe('The timer', () => {
  it('returns the time difference in milliseconds', done => {
    const timer = new Timer();
    timer.start();

    setImmediate(() => {
      const elapsedTime = timer.stop();
      expect(elapsedTime).toBeGreaterThanOrEqual(0);
      expect(elapsedTime).toBeLessThan(10);
      done();
    });
  });
});
