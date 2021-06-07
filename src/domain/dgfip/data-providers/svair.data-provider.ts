import axios from 'axios';
import {load} from 'cheerio';
import {DGFIPDataProvider} from '../data-provider';
import {DGFIPInput, DGFIPOutput} from '../dto';

export class SvairDataProvider implements DGFIPDataProvider {
  async fetch(input: DGFIPInput): Promise<DGFIPOutput> {
    const viewState = await this.getViewState();

    throw new Error('Method not implemented.');
  }

  async getViewState(): Promise<string> {
    const preResponse = await axios.get(
      'https://cfsmsp.impots.gouv.fr/secavis/faces/commun/index.jsf'
    );
    const $ = load(preResponse.data);
    return $('input[name="javax.faces.ViewState"]').val();
  }
}
