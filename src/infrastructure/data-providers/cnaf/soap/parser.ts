import {CnafOutput} from '../../../../domain/data-fetching/data-providers/cnaf/dto';
import {parse} from 'fast-xml-parser';
import {parse as dateParse} from 'date-fns';
import {InvalidFormatError} from 'src/domain/data-fetching/errors/invalid-format.error';
import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {isArray, isObject, isUndefined, omitBy, unescape} from 'lodash';

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

    const body = parse(unescape(rawBody), {
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

    const children = isArray(body.identeEnfants.UNENFANT)
      ? body.identeEnfants.UNENFANT.map(parsePerson)
      : isObject(body.identeEnfants.UNENFANT)
      ? [parsePerson(body.identeEnfants.UNENFANT)]
      : [];
    const beneficiaries = isArray(body.identePersonnes.UNEPERSONNE)
      ? body.identePersonnes.UNEPERSONNE.map(parsePerson)
      : isObject(body.identePersonnes.UNEPERSONNE)
      ? [parsePerson(body.identePersonnes.UNEPERSONNE)]
      : [];

    return {
      adresse: omitBy(address, isUndefined),
      allocataires: beneficiaries,
      enfants: children,
      quotientFamilial:
        body.quotients !== ''
          ? parseInt(body.quotients.QFMOIS.QUOTIENTF)
          : null,
      annee:
        body.quotients !== '' ? parseInt(body.quotients.QFMOIS.DELANNEE) : null,
      mois:
        body.quotients !== '' ? parseInt(body.quotients.QFMOIS.DUMOIS) : null,
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
