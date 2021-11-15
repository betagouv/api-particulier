import {expect} from 'chai';
import {Anonymizer} from 'src/domain/journal/anonymizer';

describe('The anonymizer service', () => {
  const anonymizer = new Anonymizer();
  it('hashes the payload values', () => {
    const payload = {
      firstKey: 'first value',
      secondKey: 34,
    };

    const anonymizedPayload = anonymizer.anonymizePayload(payload);

    expect(Object.keys(anonymizedPayload)).to.deep.equal(Object.keys(payload));
    expect(anonymizedPayload.firstKey).not.to.equal(payload.firstKey);
    expect(anonymizedPayload.secondKey).to.be.a('string');
  });
});
