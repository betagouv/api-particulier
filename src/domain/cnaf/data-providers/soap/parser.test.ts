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

    expect(result).toMatchInlineSnapshot(`
Object {
  "adresse": Object {
    "LIBLIG1ADR": "Madame JEANNE CROUTE",
    "LIBLIG2ADR": "",
    "LIBLIG3ADR": "",
    "LIBLIG4ADR": "23 RUE DES ROSIERS",
    "LIBLIG5ADR": "",
    "LIBLIG6ADR": "75002 PARIS",
    "LIBLIG7ADR": "FRANCE",
  },
  "identeEnfants": Object {
    "UNENFANT": Array [
      Object {
        "DATNAISS": 4032015,
        "NOMPRENOM": "MICHEL CROUTE",
        "SEXE": "M",
      },
      Object {
        "DATNAISS": 11022017,
        "NOMPRENOM": "MICHELINE CROUTE",
        "SEXE": "F",
      },
    ],
  },
  "identePersonnes": Object {
    "UNEPERSONNE": Array [
      Object {
        "DATNAISS": 5031988,
        "NOMPRENOM": "JEANNE CROUTE",
        "QUAL": "Madame",
        "SEXE": "F",
      },
      Object {
        "DATNAISS": 3051989,
        "NOMPRENOM": "JEAN CROUTE",
        "QUAL": "Monsieur",
        "SEXE": "M",
      },
    ],
  },
  "quotients": Object {
    "QFMOIS": Object {
      "DELANNEE": 2021,
      "DUMOIS": 5,
      "QUOTIENTF": 2057,
    },
  },
}
`);
  });
});
