import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ArticleEditService {

  ajaxfunc = execLib.ajaxexec('article')

  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  public updateArticle(article): Observable<any> {
    return this.ajaxfunc('editOneArticle', article)
  }

  public  deleteImage(image): Observable<any> {
    return this.ajaxfunc('deleteImage', image)
  }
}
