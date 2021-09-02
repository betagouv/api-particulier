import {Application} from 'stimulus';
import ApplicationController from './application.controller';
import NewApplicationController from './new-application.controller';
import '@hotwired/turbo';
import {faFile, faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {library, dom} from '@fortawesome/fontawesome-svg-core';

library.add(faFile, faTrashAlt);
dom.watch();

const application = Application.start();
application.register('application', ApplicationController);
application.register('new-application', NewApplicationController);
