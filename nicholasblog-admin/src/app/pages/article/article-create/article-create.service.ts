import { Injectable, Inject, Optional } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';
declare var $: any;

interface updateTemp {
  _id: string,
  title: string,
  content: string,
  classify: string
}

interface deleteImage {
  src: string;
}

@Injectable()
export class ArticleCreateService {

  ajaxfunc = execLib.ajaxexec('article')

  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  uploadArticle(article): Observable<any> {
    return this.ajaxfunc('articleCreate', article);
  }

  updateTemp(temp: updateTemp): Observable<any> {
    return this.ajaxfunc('articleTemp', temp);
  }

  deleteImage(image: deleteImage): Observable<any> {
    return this.ajaxfunc('deleteImage', image);
  }
}
