import {expect} from 'chai';
import {Timer} from 'src/domain/data-fetching/timer';

describe('The timer', () => {
  it('returns the time difference in milliseconds', done => {
    const timer = new Timer();
    timer.start();

    setImmediate(() => {
      const elapsedTime = timer.stop();
      expect(elapsedTime).to.be.greaterThanOrEqual(0);
      done();
    });
  });
});
