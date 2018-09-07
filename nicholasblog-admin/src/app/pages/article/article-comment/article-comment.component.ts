import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { ArticleCommentService } from './article-comment.service';
import { ArticleService } from '../service/article.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { execLib } from 'execlib';
declare var $: any;

@Component({
  selector: 'app-article-comment',
  templateUrl: './article-comment.component.html',
  styleUrls: [
    './article-comment.component.scss'
  ],
  providers: [
    ArticleCommentService
  ]
})
export class ArticleCommentComponent implements OnInit {

  comments = [];

  mainid = '';

  constructor(
    private _state: GlobalState,
    private service: ArticleCommentService,
    private articleService: ArticleService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  getComments(id) {
    execLib.getexec.call(this,
      this.articleService.getComments(id),
      function (res) {
        this.comments = res.comments;
      }
    )
  }

  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '文章评论' });
  }

  ngOnInit() {
    this.selectAndNotify();
    this.activatedRoute.params.subscribe(res => {
      this.getComments(res.id);
      this.mainid = res.id;
    });
  }

}
