import {CNAFOutput} from '../../dto';
import * as _ from 'lodash';
import {parse} from 'fast-xml-parser';

export class XMLParser {
  parse(xml: string) {
    const rawXML = parse(xml);
    const {codeRetour, fluxRetour, libelleRetour} =
      rawXML[Object.keys(rawXML)[0]]['soapenv:Envelope']['soapenv:Body'][
        'ns2:demanderDocumentWebResponse'
      ].return.beanRetourDemandeDocumentWeb;
    const body = parse(_.unescape(fluxRetour)).drtData;
    return body;
  }
}
