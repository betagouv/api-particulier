import {expect} from 'chai';
import {
  parseDateOrString,
  parseEuro,
} from 'src/infrastructure/data-providers/dgfip/parsing-functions';

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

    it('returns negative values', () => {
      expect(parseEuro('-15&nbsp;237 €')).to.equal(-15237);
    });
  });

  describe('parse dates', () => {
    it('reads strings with /', () => {
      expect(parseDateOrString('03/05/1991')).to.be.a('Date');
    });

    it('reads strings with -', () => {
      expect(parseDateOrString('1991-05-03')).to.deep.equal(
        new Date(1991, 4, 3)
      );
    });
  });
});
