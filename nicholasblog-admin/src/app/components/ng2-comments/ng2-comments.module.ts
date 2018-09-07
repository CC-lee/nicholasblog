import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2CommentsComponent } from './ng2-comments.component';
import { HtmlPipe } from './HtmlPipe.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Ng2CommentsComponent,
    HtmlPipe
  ],
  exports: [
    Ng2CommentsComponent,
  ],
})
export class Ng2CommentsModule { }