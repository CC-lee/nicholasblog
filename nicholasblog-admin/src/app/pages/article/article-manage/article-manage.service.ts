import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ArticleService } from '../service/article.service';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';

interface ArticleInfo {
  [index: number]: {
    article_id: string,
    classify: string,
    comment_num: number,
    create_date: string,
    like_num: number,
    timestamp: number,
    title: string,
    update_date: string,
    _id: string
  };
}

@Injectable()
export class ArticleManageService {

  constructor(
    private http: Http,
    private articleService: ArticleService
  ) { }


  smartTableData: ArticleInfo = [];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 0);
    });
  }

  getLists() { // 获取文章列表数据
    execLib.getexec.call(this,
      this.articleService.getLists(),
      function (res) {
        var resp: ArticleInfo = res.data
        this.smartTableData = resp;
      },
      null
    )
  }

}
