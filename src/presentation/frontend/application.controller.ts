import {Controller} from '@hotwired/stimulus';
import ClipboardJS from 'clipboard';

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
    const {sourceTarget, buttonTarget} = this;

    const clipboard = new ClipboardJS(this.buttonTarget, {
      target: function () {
        return sourceTarget;
      },
    });

    clipboard.on('success', () => {
      buttonTarget.innerHTML = 'Jeton copié !';
    });
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
