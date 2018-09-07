import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../components/ng2-smart-table';
import { Ng2CommentsModule } from '../../components/ng2-comments/ng2-comments.module';
import { AlbumComponent } from './album.component';
import { ImageCreateComponent } from './image-create/image-create.component';
import { ImageCreateService } from './image-create/image-create.service';

import { routing } from './album.routing';
import { AlbumManageComponent } from './album-manage/album-manage.component';
import { AlbumManageService } from './album-manage/album-manage.service';

import { ImageEditComponent } from './image-edit/image-edit.component';
import { ImageEditService } from './image-edit/image-edit.service';

import { AlbumService } from './album.service';
import { ImageCommentComponent } from './image-comment/image-comment.component';
import { FormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { AuthGuardService } from './auth-guard.service';

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
    Ng2CommentsModule,
    FormsModule,
    routing,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    DropzoneModule.forRoot(DROPZONE_CONFIG)
  ],
  declarations: [
    AlbumComponent,
    ImageCreateComponent,
    AlbumManageComponent,
    ImageEditComponent,
    ImageCommentComponent
  ],
  providers: [
    AlbumService,
    AuthGuardService
  ]
})
export class AlbumModule { }
