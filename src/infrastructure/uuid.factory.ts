import {v4 as uuidv4} from 'uuid';
import {UuidFactory as UuidFactoryInterface} from 'src/domain/uuid.factory';

export class UuidFactory implements UuidFactoryInterface {
  generateUuid(): string {
    return uuidv4();
  }
}
