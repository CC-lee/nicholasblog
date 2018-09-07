import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../components/ng2-smart-table';
import { Ng2CommentsModule } from '../../components/ng2-comments/ng2-comments.module';
import { AuthGuardService } from './auth-guard.service';
import { MessageComponent } from './message.component';
import { AdminMessageCreateComponent } from './admin-message-create/admin-message-create.component';
import { AdminMessageCreateService } from './admin-message-create/admin-message-create.service';

import { routing } from './message.routing';
import { AdminMessageManageComponent } from './admin-message-manage/admin-message-manage.component';
import { AdminMessageManageService } from './admin-message-manage/admin-message-manage.service';

import { UserMessageManageComponent } from './user-message-manage/user-message-manage.component';
import { UserMessageManageService } from './user-message-manage/user-message-manage.service';

import { AdminMessageEditComponent } from './admin-message-edit/admin-message-edit.component';
import { AdminMessageEditService } from './admin-message-edit/admin-message-edit.service';

import { MessageService } from './message.service';
import { MessageCommentComponent } from './message-comment/message-comment.component';
import { FormsModule } from '@angular/forms';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
 
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
    MessageComponent,
    AdminMessageCreateComponent,
    AdminMessageManageComponent,
    UserMessageManageComponent,
    AdminMessageEditComponent,
    MessageCommentComponent
  ],
  providers: [
    MessageService,
    AuthGuardService
  ]
})
export class MessageModule { }
