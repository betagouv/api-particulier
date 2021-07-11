import axios, {AxiosResponse} from 'axios';
import {Agent} from 'https';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {DataProvider} from '../../../../domain/data-fetching/data-providers/data-provider';
import {
  CnafInput,
  CnafOutput,
} from '../../../../domain/data-fetching/data-providers/cnaf/dto';
import {XMLParser} from './parser';

export class SoapDataProvider implements DataProvider<CnafInput, CnafOutput> {
  private readonly parser = new XMLParser();

  async fetch(input: CnafInput): Promise<CnafOutput> {
    let response: AxiosResponse;

    try {
      response = await axios.post(
        `${process.env.CAF_HOST}/sgmap/wswdd/v1`,
        buildQuery(input),
        {
          httpsAgent: buildHttpsAgent(),
          headers: {'Content-Type': 'text/xml; charset=utf-8'},
        }
      );
    } catch (err) {
      throw new NetworkError(err);
    }

    return this.parser.parse(response.data);
  }
}

const buildQuery = (
  input: CnafInput
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
