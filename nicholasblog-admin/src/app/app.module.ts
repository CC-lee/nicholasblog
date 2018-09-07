import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './app.routing';

import { AppService, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
import { APP_BASE_HREF } from '@angular/common';

import { execLib } from 'execlib';

const APP_PROVIDERS = [
  AppService,
  GlobalState
];

export type StoreType = {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing
  ],
  providers: [
    APP_PROVIDERS,
    { provide: APP_BASE_HREF, useValue: execLib.urlMiddlePrefix }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appService: AppService) {
  }
}



