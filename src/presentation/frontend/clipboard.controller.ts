import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = ['source', 'button'];
  sourceTarget!: Element;
  buttonTarget!: Element;

  connect() {
    if (document.queryCommandSupported('copy')) {
      this.buttonTarget.classList.remove('hidden');
    }
  }

  copy() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.sourceTarget.select();
    document.execCommand('copy');
    this.buttonTarget.innerHTML = 'Jeton copié !';
  }
}
