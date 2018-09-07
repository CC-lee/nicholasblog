import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ArticleService {

  ajaxfunc = execLib.ajaxexec('article')
  ajaxfunctag = execLib.ajaxexec('classify')

  constructor(
    private http: Http,
    public auth: AuthService
  ) {

  }

  // 获取临时数据
  getTemp(data) {
    return this.ajaxfunc('getArticleTemp', data);
  }

  getClassfy() {
    return this.ajaxfunctag('classList', null);
  }
  // 获取文章列表数据
  getLists() {
    return this.ajaxfunc('articleInfo', null);
  }

  getOneArticle(data): Observable<any> {
    return this.ajaxfunc('backOneArticle', data);
  }

  getComments(id): Observable<any> {
    return this.ajaxfunc('backAllComments', { article_id: id });
  }

  createLoadImage(data) {
    return this.ajaxfunc('createLoadImage', data)
  }

  eidtLoadImage(data) {
    return this.ajaxfunc('eidtLoadImage', data)
  }
}


