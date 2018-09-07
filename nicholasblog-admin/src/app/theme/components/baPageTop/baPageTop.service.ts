import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';

@Injectable()
export class BaPageTopService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'Authorization': localStorage.getItem(execLib.tokenName)
  });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  loadAvatar(): Observable<any> {
    return this.http.get(`${execLib.apiName}admin/avatar`, this.options).map(res => res.json());
  }

}