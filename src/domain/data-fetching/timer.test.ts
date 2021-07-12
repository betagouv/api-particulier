import {Timer} from 'src/domain/data-fetching/timer';

describe('The timer', () => {
  it('returns the time difference in milliseconds', done => {
    const timer = new Timer();
    timer.start();

    setImmediate(() => {
      const elapsedTime = timer.stop();
      expect(elapsedTime).toBeGreaterThanOrEqual(0);
      done();
    });
  });
});
