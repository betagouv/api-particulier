import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = ['button', 'form'];
  buttonTarget!: Element;
  formTarget!: Element;

  reveal() {
    this.buttonTarget.classList.add('hidden');
    this.formTarget.classList.remove('hidden');
  }
}
