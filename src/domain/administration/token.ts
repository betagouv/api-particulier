import {Brand} from 'src/domain/branded-types';

export type TokenId = Brand<string, 'TokenId'>;

export class Token {
  constructor(
    public readonly id: TokenId,
    public readonly createdOn: Date,
    public readonly hash: string
  ) {}
}
