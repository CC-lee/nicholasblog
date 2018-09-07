import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../components/ng2-smart-table';
import { ShopComponent } from './shop.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemCreateService } from './item-create/item-create.service';

import { routing } from './shop.routing';
import { ShopManageComponent } from './shop-manage/shop-manage.component';
import { ShopManageService } from './shop-manage/shop-manage.service';

import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemEditService } from './item-edit/item-edit.service';

import { ShopService } from './shop.service';
import { FormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { AuthGuardService } from './auth-guard.service';
import { SelectItemComponent } from './components/selectItem/selectItem.component'

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/gif,image/jpeg,image/jpg,image/png',
  createImageThumbnails: true
};

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    Ng2SmartTableModule,
    FormsModule,
    routing,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    DropzoneModule.forRoot(DROPZONE_CONFIG)
  ],
  declarations: [
    ShopComponent,
    ItemCreateComponent,
    ShopManageComponent,
    ItemEditComponent,
    ShopManageComponent,
    ItemEditComponent,
    SelectItemComponent
],
  providers: [
    ShopService,
    AuthGuardService
  ]
})
export class ShopModule { }
