import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = ['source', 'button'];
  sourceTarget: any;
  buttonTarget: any;

  connect() {
    if (document.queryCommandSupported('copy')) {
      this.buttonTarget.classList.remove('hidden');
    }
  }

  copy() {
    this.sourceTarget.select();
    document.execCommand('copy');
    this.buttonTarget.innerHTML = 'Jeton copié !';
  }
}
