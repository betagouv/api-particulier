import axios from 'axios';
import {load} from 'cheerio';
import {DGFIPDataProvider} from '../data-provider';
import {DGFIPInput, DGFIPOutput} from '../dto';
import {result as parseSvairResponse} from '../parsers/legacy.parser.js';

export class SvairDataProvider implements DGFIPDataProvider {
  async fetch(input: DGFIPInput): Promise<DGFIPOutput> {
    const viewState = await this.getViewState();

    const response = await axios.post(
      'https://cfsmsp.impots.gouv.fr/secavis/faces/commun/index.jsf',
      {
        'j_id_7:spi': input.taxNumber,
        'j_id_7:num_facture': input.taxNoticeNumber,
        'j_id_7:j_id_l': 'Valider',
        j_id_7_SUBMIT: 1,
        'javax.faces.ViewState': viewState,
      }
    );

    return await parseSvairResponse(response.data, 2020);
  }

  async getViewState(): Promise<string> {
    const preResponse = await axios.get(
      'https://cfsmsp.impots.gouv.fr/secavis/faces/commun/index.jsf'
    );
    const $ = load(preResponse.data);
    return $('input[name="javax.faces.ViewState"]').val();
  }
}
