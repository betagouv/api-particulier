import {Controller} from '@hotwired/stimulus';

export default class extends Controller {
  static targets = [
    'source',
    'button',
    'scopes',
    'displayScopesLink',
    'deleteForm',
  ];
  sourceTarget!: HTMLInputElement;
  buttonTarget!: Element;
  scopesTarget!: Element;
  displayScopesLinkTarget!: Element;
  deleteFormTarget!: HTMLFormElement;

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

  toggleScopesDisplay() {
    this.scopesTarget.classList.toggle('hidden');
    this.displayScopesLinkTarget.innerHTML =
      this.scopesTarget.classList.contains('hidden')
        ? 'Afficher les scopes'
        : 'Cacher les scopes';
  }

  delete() {
    this.deleteFormTarget.submit();
  }
}
