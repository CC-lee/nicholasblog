import { Routes, RouterModule } from '@angular/router';
import { ArticleComponent } from './article.component';
import { ArticleManageComponent } from './article-manage/article-manage.component';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleCommentComponent } from './article-comment/article-comment.component';
import { AuthGuardService } from './auth-guard.service';

import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    canActivateChild: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'articlemanage', pathMatch: 'full' },
      { path: 'articlemanage', component: ArticleManageComponent },
      { path: 'articlecreate', component: ArticleCreateComponent },
      { path: 'articleedit/:id', component: ArticleEditComponent },
      { path: 'articlecomment/:id', component: ArticleCommentComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
