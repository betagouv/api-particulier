const fs = require('fs');
const parse = require('./legacy.parser');

describe('Parse ', () => {
  const parseEuro = parse.euro;
  const parseResult = parse.result;
  const postHttpResponse = fs.readFileSync(
    __dirname + '/__tests__/resources/postHttpResponse.txt',
    'utf-8'
  );
  const getHttpResponse = fs.readFileSync(
    __dirname + '/__tests__/resources/getHttpResponse.txt',
    'utf-8'
  );
  const postHttpResponse2 = fs.readFileSync(
    __dirname + '/__tests__/resources/postHttpResponse2.txt',
    'utf-8'
  );
  const postHttpEmptyCell = fs.readFileSync(
    __dirname + '/__tests__/resources/postHttpResponseEmptyCell.txt',
    'utf-8'
  );

  describe('parse Euro', () => {
    it('removes space', () => {
      expect(parseEuro('13 000')).toEqual(13000);
    });

    it('removes € symbol', () => {
      expect(parseEuro('13000€')).toEqual(13000);
    });

    it('removes non breakable space symbol', () => {
      expect(parseEuro('13\u00A0000')).toEqual(13000);
    });

    it('removes space € symbol', () => {
      expect(parseEuro('1 665 €\n\t\t\t\t\t')).toEqual(1665);
    });

    it('returns 0 if no data', () => {
      expect(parseEuro('')).toEqual(0);
    });
  });

  describe('parse Response', () => {
    describe('for the badly formatted response', () => {
      it('returns an error', async () => {
        expect(parseResult(getHttpResponse, 2015)).rejects.toEqual(
          new Error('Parsing error')
        );
      });
    });

    describe('for the single person', () => {
      it('extracts the data', async () => {
        const result = await parseResult(postHttpResponse, 2015);

        expect(result).toEqual({
          anneeImpots: '2015',
          anneeRevenus: '2014',
          dateEtablissement: '08/07/2015',
          dateRecouvrement: '31/07/2015',
          declarant1: {
            dateNaissance: '29/03/1984',
            nom: 'MARTIN',
            nomNaissance: 'MARTIN',
            prenoms: 'Jean',
          },
          declarant2: {
            dateNaissance: '',
            nom: '',
            nomNaissance: '',
            prenoms: '',
          },
          foyerFiscal: {
            adresse: "34 RUE DE L'EGLISE 75009 PARIS",
            annee: 2015,
          },
          impotRevenuNetAvantCorrections: 1665,
          montantImpot: 1665,
          nombreParts: 1,
          nombrePersonnesCharge: 0,
          revenuBrutGlobal: 17580,
          revenuFiscalReference: 17580,
          revenuImposable: 17580,
          situationFamille: 'Célibataire',
        });
      });
    });

    describe('for two people', () => {
      it('extracts the data', async () => {
        const result = await parseResult(postHttpResponse2, 2014);

        expect(result).toEqual({
          anneeImpots: '2014',
          anneeRevenus: '2013',
          dateEtablissement: '30/07/2014',
          dateRecouvrement: '31/07/2014',
          declarant1: {
            dateNaissance: '31/12/1959',
            nom: 'HONORE',
            nomNaissance: 'HONORE',
            prenoms: 'Jean',
          },
          declarant2: {
            dateNaissance: '11/06/1968',
            nom: 'MARTIN',
            nomNaissance: 'MARTIN',
            prenoms: 'Laurence',
          },
          foyerFiscal: {
            adresse: 'APT. 509 47 rue de carnot 94320 THIAIS',
            annee: 2014,
          },
          impotRevenuNetAvantCorrections: null,
          montantImpot: null,
          nombreParts: 4,
          nombrePersonnesCharge: 3,
          revenuBrutGlobal: 0,
          revenuFiscalReference: 0,
          revenuImposable: 0,
          situationFamille: 'Marié(e)s',
        });
      });
    });

    describe('with empty cells', () => {
      it('returns null values', async () => {
        const result = await parseResult(postHttpEmptyCell, 2015);

        expect(result.revenuBrutGlobal).toBeNull();
      });
    });
  });
});
