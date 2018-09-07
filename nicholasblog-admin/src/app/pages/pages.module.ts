import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AuthService } from './auth.service';
import { Routes, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing
  ],
  declarations: [PagesComponent],
  providers: [AuthService]
})
export class PagesModule { }