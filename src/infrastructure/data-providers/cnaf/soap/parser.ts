import {CnafOutput} from '../../../../domain/data-fetching/data-providers/cnaf/dto';
const _ = require('lodash');
import {parse} from 'fast-xml-parser';
import {parse as dateParse} from 'date-fns';
import {InvalidFormatError} from 'src/domain/data-fetching/data-providers/cnaf/errors/invalid-format.error';
import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';

export class XMLParser {
  parse(xml: string): CnafOutput {
    let rawBody;
    let returnCode;
    try {
      const rawXML = parse(xml);
      const result =
        rawXML[Object.keys(rawXML)[0]]['soapenv:Envelope']['soapenv:Body'][
          'ns2:demanderDocumentWebResponse'
        ].return.beanRetourDemandeDocumentWeb;
      returnCode = parseInt(result.codeRetour);
      rawBody = result.fluxRetour;
    } catch (err) {
      throw new InvalidFormatError();
    }

    if (returnCode !== 0) {
      throw new CnafError(returnCode);
    }

    const body = parse(_.unescape(rawBody), {
      parseNodeValue: false,
    }).drtData;

    const address = {
      identite: parseString(body.adresse.LIBLIG1ADR),
      complementIdentite: parseString(body.adresse.LIBLIG2ADR),
      complementIdentiteGeo: parseString(body.adresse.LIBLIG3ADR),
      numeroRue: parseString(body.adresse.LIBLIG4ADR),
      lieuDit: parseString(body.adresse.LIBLIG5ADR),
      codePostalVille: parseString(body.adresse.LIBLIG6ADR),
      pays: parseString(body.adresse.LIBLIG7ADR),
    };

    const children = body.identeEnfants.UNENFANT.map(parsePerson);
    const beneficiaries = body.identePersonnes.UNEPERSONNE.map(parsePerson);

    return {
      adresse: _.omitBy(address, _.isUndefined),
      allocataires: beneficiaries,
      enfants: children,
      quotientFamilial: parseInt(body.quotients.QFMOIS.QUOTIENTF),
      annee: parseInt(body.quotients.QFMOIS.DELANNEE),
      mois: parseInt(body.quotients.QFMOIS.DUMOIS),
    };
  }
}

const parsePerson = (person: {
  NOMPRENOM: string;
  DATNAISS: string;
  SEXE: string;
}) => ({
  nomPrenom: person.NOMPRENOM,
  dateDeNaissance: dateParse(person.DATNAISS, 'ddMMyyyy', new Date()),
  sexe: person.SEXE,
});

const parseString = (str: string) => (str !== '' ? str : undefined);
