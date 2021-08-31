import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = ['source', 'button', 'scopes', 'displayScopesLink'];
  sourceTarget!: Element;
  buttonTarget!: Element;
  scopesTarget!: Element;
  displayScopesLinkTarget!: Element;

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

  toggleScopesDisplay() {
    this.scopesTarget.classList.toggle('hidden');
    this.displayScopesLinkTarget.innerHTML =
      this.scopesTarget.classList.contains('hidden')
        ? 'Afficher les scopes'
        : 'Cacher les scopes';
  }
}
