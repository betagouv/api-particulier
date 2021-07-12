import axios, {AxiosResponse} from 'axios';
import {load} from 'cheerio';
import {stringify} from 'query-string';
import {DgfipDataProvider} from 'src/domain/data-fetching/data-providers/dgfip/data-provider';
import {
  DgfipInput,
  DgfipOutput,
} from 'src/domain/data-fetching/data-providers/dgfip/dto';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';
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
    } catch (error) {
      throw transformError(error);
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
    } catch (error) {
      throw transformError(error);
    }
  }
}
