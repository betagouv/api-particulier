import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = ['button', 'form', 'submitButton'];
  buttonTarget!: Element;
  formTarget!: Element;
  submitButtonTarget!: Element;

  connect() {
    this.buttonTarget.classList.remove('hidden');
    this.formTarget.classList.add('hidden');
  }

  reveal() {
    this.buttonTarget.classList.add('hidden');
    this.formTarget.classList.remove('hidden');
  }

  onSubmit() {
    this.submitButtonTarget.setAttribute('disabled', 'true');
    this.submitButtonTarget.classList.add('bg-gray-400');
    this.submitButtonTarget.setAttribute('value', 'Création en cours...');
  }
}
