import {createHash} from 'crypto';

type Payload = {
  [key: string]: unknown;
};

export class Anonymizer {
  anonymizePayload(payload: Payload): Payload {
    return Object.keys(payload).reduce((anonymizedPayload, key) => {
      return {
        ...anonymizedPayload,
        [key]: createHash('sha512')
          .update('' + payload[key])
          .digest('hex'),
      };
    }, {});
  }
}
