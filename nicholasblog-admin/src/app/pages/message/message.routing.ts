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
      { path: 'adminmessagemanage', component: AdminMessageManageComponent, data: { title: '管理者信息管理' } },
      { path: 'usermessagemanage', component: UserMessageManageComponent, data: { title: '用户信息管理' } },
      { path: 'adminmessagecreate', component: AdminMessageCreateComponent, data: { title: '管理者信息创建' } },
      { path: 'adminmessageedit/:id', component: AdminMessageEditComponent, data: { title: '管理者信息编辑' } },
      { path: 'messagecomment/:id', component: MessageCommentComponent, data: { title: '信息评论' } }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
