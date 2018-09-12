import { Routes, RouterModule } from '@angular/router';
import { AlbumComponent } from './album.component';
import { AlbumManageComponent } from './album-manage/album-manage.component';
import { ImageCreateComponent } from './image-create/image-create.component';
import { ImageEditComponent } from './image-edit/image-edit.component';
import { ImageCommentComponent } from './image-comment/image-comment.component';

import { ModuleWithProviders } from '@angular/core';
import { AuthGuardService } from './auth-guard.service';


export const routes: Routes = [
  {
    path: '',
    component: AlbumComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'albummanage', pathMatch: 'full' },
      { path: 'albummanage', component: AlbumManageComponent, data: { title: '相册管理' } },
      { path: 'imagecreate', component: ImageCreateComponent, data: { title: '图片创建' } },
      { path: 'imageedit/:id', component: ImageEditComponent, data: { title: '图片编辑' } },
      { path: 'imagecomment/:id', component: ImageCommentComponent, data: { title: '图片评论' } }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
