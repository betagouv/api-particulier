import {createHash} from 'crypto';
import {Payload} from 'src/domain/payload';

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
