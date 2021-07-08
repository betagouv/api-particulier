import {CNAFOutput} from '../../../../domain/gateway/cnaf/dto';
import * as _ from 'lodash';
import {parse} from 'fast-xml-parser';
import {parse as dateParse} from 'date-fns';
import {InvalidFormatError} from 'src/domain/gateway/cnaf/errors/invalid-format.error';
import {CNAFError} from 'src/domain/gateway/cnaf/errors/cnaf.error';

export class XMLParser {
  parse(xml: string): CNAFOutput {
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
      throw new CNAFError(returnCode);
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
