import {readFileSync} from 'fs';
import {XMLParser} from './parser';

describe('The CNAF XML parser', () => {
  it('parses the XML', () => {
    const parser = new XMLParser();
    const okXML = readFileSync(
      __dirname + '/__tests__/resources/ok.txt',
      'utf-8'
    );

    const result = parser.parse(okXML);

    expect(result).toEqual({
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
});