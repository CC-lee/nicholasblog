import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ClassService {
  ajaxfunc = execLib.ajaxexec('classify')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }
  getLists() { // 获取分类列表数据
    return this.ajaxfunc('classList', null);
  }
  getOneClass(id) {
    return this.ajaxfunc('getOneClass', { _id: id });
  }
}
