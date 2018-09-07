import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../components/ng2-smart-table';
import { UserComponent } from './user.component';
import { AuthGuardService } from './auth-guard.service';

import { routing } from './user.routing';
import { UserManageComponent } from './user-manage/user-manage.component';
import { UserManageService } from './user-manage/user-manage.service';

import { OrderlistManageComponent } from './orderlist-manage/orderlist-manage.component';
import { OrderlistManageService } from './orderlist-manage/orderlist-manage.service';

import { OrderlistEditComponent } from './orderlist-edit/orderlist-edit.component';
import { OrderlistEditService } from './orderlist-edit/orderlist-edit.service';


import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    Ng2SmartTableModule,
    FormsModule,
    routing,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [
    UserComponent,
    UserManageComponent,
    OrderlistManageComponent,
    OrderlistEditComponent,
    OrderlistEditComponent,
    OrderlistManageComponent
  ],
  providers: [
    UserService,
    AuthGuardService
  ]
})
export class UserModule { }
