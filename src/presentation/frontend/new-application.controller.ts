import {Controller} from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['button', 'form', 'submitButton'];
  buttonTarget!: Element;
  formTarget!: Element;
  submitButtonTarget!: Element;

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
