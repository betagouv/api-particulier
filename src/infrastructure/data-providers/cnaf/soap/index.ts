import axios from 'axios';
import {Agent} from 'https';
import {DataProvider} from '../../../../domain/application/data-provider';
import {CNAFInput, CNAFOutput} from '../../../../domain/cnaf/dto';
import {XMLParser} from './parser';

export class SoapDataProvider implements DataProvider<CNAFInput, CNAFOutput> {
  private readonly parser = new XMLParser();

  async fetch(input: CNAFInput): Promise<CNAFOutput> {
    const response = await axios.post(
      `${process.env.CAF_HOST}/sgmap/wswdd/v1`,
      buildQuery(input),
      {
        httpsAgent: buildHttpsAgent(),
        headers: {'Content-Type': 'text/xml; charset=utf-8'},
      }
    );

    return this.parser.parse(response.data);
  }
}

const buildQuery = (
  input: CNAFInput
) => `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://v1.ws.wsdemandedocumentcafweb.cnaf/">
<soap:Header/>
<soap:Body>
    <tns:demanderDocumentWeb xmlns:tns="http://v1.ws.wsdemandedocumentcafweb.cnaf/">
	<arg0>
	    <app>WDD</app>
	    <id>?</id>
	    <beanEntreeDemandeDocumentWeb>
		<codeAppli>WDD</codeAppli>
		<matricule>${input.numeroAllocataire}</matricule>
		<codePostal>${input.codePostal}</codePostal>
		<typeDocument>4</typeDocument>
		<typeEnvoi>5</typeEnvoi>
	    </beanEntreeDemandeDocumentWeb>
	</arg0>
    </tns:demanderDocumentWeb>
</soap:Body>
</soap:Envelope>`;

const buildHttpsAgent = (): Agent =>
  new Agent({
    rejectUnauthorized: false,
    cert: process.env.CAF_CERTIFICATE,
    key: process.env.CAF_PRIVATE_KEY,
  });
