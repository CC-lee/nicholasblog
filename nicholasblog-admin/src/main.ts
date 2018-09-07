import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import wholeConf from '../wholeConfAdmin'


if (wholeConf.status === 'prod' || wholeConf.status === 'deploy') {
  enableProdMode();
}
declare const require: any;
require('es6-promise').polyfill();

platformBrowserDynamic().bootstrapModule(AppModule);
