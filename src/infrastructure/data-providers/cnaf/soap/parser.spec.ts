import {expect} from 'chai';
import {readFileSync} from 'fs';
import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {InvalidFormatError} from 'src/domain/data-fetching/errors/invalid-format.error';
import {XMLParser} from './parser';

describe('The CNAF XML parser', () => {
  const parser = new XMLParser();

  it('parses the XML', () => {
    const okXML = readFileSync(
      __dirname + '/__tests__/resources/ok.txt',
      'utf-8'
    );

    const result = parser.parse(okXML);

    expect(result).to.deep.equal({
      adresse: {
        codePostalVille: '75002 PARIS',
        identite: 'Madame JEANNE CROUTE',
        numeroRue: '23 RUE DES ROSIERS',
        pays: 'FRANCE',
      },
      allocataires: [
        {
          dateDeNaissance: new Date('03-05-1988'),
          nomPrenom: 'JEANNE CROUTE',
          sexe: 'F',
        },
        {
          dateDeNaissance: new Date('05-03-1989'),
          nomPrenom: 'JEAN CROUTE',
          sexe: 'M',
        },
      ],
      annee: 2021,
      enfants: [
        {
          dateDeNaissance: new Date('03-04-2015'),
          nomPrenom: 'MICHEL CROUTE',
          sexe: 'M',
        },
        {
          dateDeNaissance: new Date('02-11-2017'),
          nomPrenom: 'MICHELINE CROUTE',
          sexe: 'F',
        },
      ],
      mois: 5,
      quotientFamilial: 2057,
    });
  });

  it('parses the XML for single persons', () => {
    const singlePersonXml = readFileSync(
      __dirname + '/__tests__/resources/single-person.txt',
      'utf-8'
    );

    const result = parser.parse(singlePersonXml);

    expect(result).to.deep.equal({
      adresse: {
        codePostalVille: '75002 PARIS',
        identite: 'Madame JEANNE CROUTE',
        numeroRue: '23 RUE DES ROSIERS',
        pays: 'FRANCE',
      },
      allocataires: [
        {
          dateDeNaissance: new Date(1984, 4, 28),
          nomPrenom: 'JEAN CROUTE',
          sexe: 'F',
        },
      ],
      annee: 2021,
      enfants: [
        {
          dateDeNaissance: new Date('03-04-2015'),
          nomPrenom: 'MICHEL CROUTE',
          sexe: 'M',
        },
        {
          dateDeNaissance: new Date('02-11-2017'),
          nomPrenom: 'MICHELINE CROUTE',
          sexe: 'F',
        },
      ],
      mois: 7,
      quotientFamilial: 672,
    });
  });

  it('returns domain error when xml is invalid', () => {
    expect(() => parser.parse('yolo<')).to.throw(InvalidFormatError);
  });

  it('returns CNAF error if webservice provides a non-null error code', () => {
    const koXML = readFileSync(
      __dirname + '/__tests__/resources/ko.txt',
      'utf-8'
    );
    expect(() => parser.parse(koXML)).to.throw(CnafError);
  });

  it('returns null values when the quotient is missing', () => {
    const missingQuotientXml = readFileSync(
      __dirname + '/__tests__/resources/missing-quotient.txt',
      'utf-8'
    );
    const result = parser.parse(missingQuotientXml);

    expect(result.quotientFamilial).to.be.null;
    expect(result.mois).to.be.null;
    expect(result.annee).to.be.null;
  });
});
