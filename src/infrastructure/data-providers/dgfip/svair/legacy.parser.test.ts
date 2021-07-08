import {InvalidCredentialsError} from 'src/domain/administration/dgfip/errors/invalid-credentials.error';
import {InvalidFormatError} from 'src/domain/administration/dgfip/errors/invalid-format.error';

const fs = require('fs');
const parse = require('./legacy.parser');

describe('Parse ', () => {
  const parseEuro = parse.euro;
  const parseResult = parse.result;
  const singlePersonResponse = fs.readFileSync(
    __dirname + '/__tests__/resources/single-person.txt',
    'utf-8'
  );
  const twoPeopleResponse = fs.readFileSync(
    __dirname + '/__tests__/resources/two-people.txt',
    'utf-8'
  );
  const emptyCell = fs.readFileSync(
    __dirname + '/__tests__/resources/empty-cell.txt',
    'utf-8'
  );
  const partialSituation = fs.readFileSync(
    __dirname + '/__tests__/resources/situation-partielle.txt',
    'utf-8'
  );
  const fixError = fs.readFileSync(
    __dirname + '/__tests__/resources/erreur-correctif.txt',
    'utf-8'
  );
  const invalidCredentials = fs.readFileSync(
    __dirname + '/__tests__/resources/missing-error.txt',
    'utf-8'
  );
  const invalidFormat = fs.readFileSync(
    __dirname + '/__tests__/resources/invalid-format.txt',
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

    it('removes any non numeric symbol', () => {
      expect(parseEuro('32&nbsp;011 €')).toEqual(32011);
    });

    it('removes space € symbol', () => {
      expect(parseEuro('1 665 €\n\t\t\t\t\t')).toEqual(1665);
    });

    it('returns 0 if no data', () => {
      expect(parseEuro('')).toEqual(0);
    });
  });

  describe('parse Response', () => {
    it('works with a single person', async () => {
      const result = await parseResult(singlePersonResponse, 2015);

      expect(result).toEqual({
        anneeImpots: 2015,
        anneeRevenus: 2014,
        dateEtablissement: new Date(2015, 6, 7),
        dateRecouvrement: new Date(2015, 6, 30),
        declarant1: {
          dateNaissance: new Date(1984, 2, 28),
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

    it('works with two people', async () => {
      const result = await parseResult(twoPeopleResponse, 2014);

      expect(result).toEqual({
        anneeImpots: 2014,
        anneeRevenus: 2013,
        dateEtablissement: new Date(2014, 6, 29),
        dateRecouvrement: new Date(2014, 6, 30),
        declarant1: {
          dateNaissance: new Date(1959, 11, 30),
          nom: 'HONORE',
          nomNaissance: 'HONORE',
          prenoms: 'Jean',
        },
        declarant2: {
          dateNaissance: new Date(1968, 5, 10),
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
        revenuBrutGlobal: 32810,
        revenuFiscalReference: 32011,
        revenuImposable: 32010,
        situationFamille: 'Marié(e)s',
      });
    });

    it('works with empty cells', async () => {
      const result = await parseResult(emptyCell, 2015);

      expect(result.revenuBrutGlobal).toBeNull();
    });

    it('works with a partial situation', async () => {
      const result = await parseResult(partialSituation, 2018);

      expect(result).toEqual({
        anneeImpots: 2018,
        anneeRevenus: 2017,
        dateEtablissement: new Date(2015, 6, 7),
        dateRecouvrement: new Date(2015, 6, 30),
        declarant1: {
          dateNaissance: new Date(1984, 2, 28),
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
          annee: 2018,
        },

        impotRevenuNetAvantCorrections: 1665,
        montantImpot: 1665,
        nombreParts: 1,
        nombrePersonnesCharge: 0,
        revenuBrutGlobal: 17580,
        revenuFiscalReference: 17580,
        revenuImposable: 17580,
        situationFamille: 'Célibataire',
        situationPartielle: '(*) Situation  2015  partielle',
      });
    });

    it('works with an error fix', async () => {
      const result = await parseResult(fixError, 2018);

      expect(result).toEqual({
        anneeImpots: 2018,
        anneeRevenus: 2017,
        dateEtablissement: new Date(2015, 6, 7),
        dateRecouvrement: new Date(2015, 6, 30),
        declarant1: {
          dateNaissance: new Date(1984, 2, 28),
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
        erreurCorrectif:
          'Ce document ne correspond pas à la situation la plus récente pour cet usager',
        foyerFiscal: {
          adresse: "34 RUE DE L'EGLISE 75009 PARIS",
          annee: 2018,
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

    it('returns domain error when data is not found', async () => {
      await expect(
        parseResult(invalidCredentials, 2018)
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('returns domain error when data format is invalid', async () => {
      await expect(parseResult(invalidFormat, 2018)).rejects.toBeInstanceOf(
        InvalidFormatError
      );
    });
  });
});
