import { Routes, RouterModule } from '@angular/router';
import { MessageComponent } from './message.component';
import { AdminMessageManageComponent } from './admin-message-manage/admin-message-manage.component';
import { UserMessageManageComponent } from './user-message-manage/user-message-manage.component';
import { AdminMessageCreateComponent } from './admin-message-create/admin-message-create.component';
import { AdminMessageEditComponent } from './admin-message-edit/admin-message-edit.component';
import { MessageCommentComponent } from './message-comment/message-comment.component';
import { AuthGuardService } from './auth-guard.service';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: MessageComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'messagemanage', pathMatch: 'full' },
      { path: 'adminmessagemanage', component: AdminMessageManageComponent },
      { path: 'usermessagemanage', component: UserMessageManageComponent },
      { path: 'adminmessagecreate', component: AdminMessageCreateComponent },
      { path: 'adminmessageedit/:id', component: AdminMessageEditComponent },
      { path: 'messagecomment/:id', component: MessageCommentComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
