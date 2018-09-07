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
      { path: 'albummanage', component: AlbumManageComponent },
      { path: 'imagecreate', component: ImageCreateComponent },
      { path: 'imageedit/:id', component: ImageEditComponent },
      { path: 'imagecomment/:id', component: ImageCommentComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
