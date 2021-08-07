import {Application} from 'stimulus';
import ClipboardController from './clipboard.controller';

const application = Application.start();
application.register('clipboard', ClipboardController);
