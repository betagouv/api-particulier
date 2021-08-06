import {expect} from 'chai';
import {parseEuro} from 'src/infrastructure/data-providers/dgfip/parsing-functions';

describe('Parse ', () => {
  describe('parse Euro', () => {
    it('removes space', () => {
      expect(parseEuro('13 000')).to.equal(13000);
    });

    it('removes € symbol', () => {
      expect(parseEuro('13000€')).to.equal(13000);
    });

    it('removes non breakable space symbol', () => {
      expect(parseEuro('13\u00A0000')).to.equal(13000);
    });

    it('removes any non numeric symbol', () => {
      expect(parseEuro('32&nbsp;011 €')).to.equal(32011);
    });

    it('removes space € symbol', () => {
      expect(parseEuro('1 665 €\n\t\t\t\t\t')).to.equal(1665);
    });

    it('returns undefined if no data', () => {
      expect(parseEuro('')).to.be.undefined;
    });
  });
});
