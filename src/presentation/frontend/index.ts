import {Application} from 'stimulus';
import feather from 'feather-icons';
import ApplicationController from './application.controller';
import NewApplicationController from './new-application.controller';
import '@hotwired/turbo';

window.feather = feather;

const application = Application.start();
application.register('application', ApplicationController);
application.register('new-application', NewApplicationController);
