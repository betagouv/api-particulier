import axios, {AxiosResponse} from 'axios';
import {load} from 'cheerio';
import {stringify} from 'query-string';
import {DgfipDataProvider} from 'src/domain/gateway/data-providers/dgfip/data-provider';
import {
  DgfipInput,
  DgfipOutput,
} from 'src/domain/gateway/data-providers/dgfip/dto';
import {NetworkError} from 'src/domain/gateway/errors/network.error';
import {result as parseSvairResponse} from './legacy.parser';

export class SvairDataProvider implements DgfipDataProvider {
  async fetch(input: DgfipInput): Promise<DgfipOutput> {
    const viewState = await this.getViewState();

    let response: AxiosResponse;
    try {
      response = await axios.post(
        'https://cfsmsp.impots.gouv.fr/secavis/faces/commun/index.jsf',
        stringify({
          'j_id_7:spi': input.taxNumber,
          'j_id_7:num_facture': input.taxNoticeNumber,
          'j_id_7:j_id_l': 'Valider',
          j_id_7_SUBMIT: 1,
          'javax.faces.ViewState': viewState,
        }),
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      );
    } catch (err) {
      throw new NetworkError(err);
    }

    return await parseSvairResponse(response.data);
  }

  async getViewState(): Promise<string> {
    try {
      const preResponse = await axios.get(
        'https://cfsmsp.impots.gouv.fr/secavis/faces/commun/index.jsf'
      );
      const $ = load(preResponse.data);
      return $('input[name="javax.faces.ViewState"]').val();
    } catch (err) {
      throw new NetworkError(err);
    }
  }
}
