import {Application} from 'stimulus';
import feather from 'feather-icons';
import ClipboardController from './clipboard.controller';
import NewApplicationController from './new-application.controller';
import '@hotwired/turbo';

window.feather = feather;

const application = Application.start();
application.register('clipboard', ClipboardController);
application.register('new-application', NewApplicationController);
