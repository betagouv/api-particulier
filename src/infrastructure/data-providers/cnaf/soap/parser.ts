import {CNAFOutput} from '../../../../domain/cnaf/dto';
import * as _ from 'lodash';
import {parse} from 'fast-xml-parser';
import {parse as dateParse} from 'date-fns';

export class XMLParser {
  parse(xml: string): CNAFOutput {
    const rawXML = parse(xml);
    const {codeRetour, fluxRetour, libelleRetour} =
      rawXML[Object.keys(rawXML)[0]]['soapenv:Envelope']['soapenv:Body'][
        'ns2:demanderDocumentWebResponse'
      ].return.beanRetourDemandeDocumentWeb;
    const body = parse(_.unescape(fluxRetour), {parseNodeValue: false}).drtData;

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
