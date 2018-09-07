import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../components/ng2-smart-table';
import { Ng2CommentsModule } from '../../components/ng2-comments/ng2-comments.module';
import { ArticleComponent } from './article.component';
import { ArticleManageComponent } from './article-manage/article-manage.component';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleCommentComponent } from './article-comment/article-comment.component';
import { routing } from './article.routing';
import { ArticleService } from './service/article.service';
import { FormsModule } from '@angular/forms';
import { AuthGuardService } from './auth-guard.service';
import { Ng2CompleterModule } from "ng2-completer";

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    Ng2SmartTableModule,
    Ng2CommentsModule,
    FormsModule,
    Ng2CompleterModule,
    routing,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [
    ArticleComponent,
    ArticleCreateComponent,
    ArticleManageComponent,
    ArticleEditComponent,
    ArticleCommentComponent
  ],
  providers: [
    ArticleService,
    AuthGuardService
  ]
})
export class ArticleModule { }
