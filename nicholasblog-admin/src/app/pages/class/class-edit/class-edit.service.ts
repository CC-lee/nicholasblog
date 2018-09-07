import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ClassEditService {
  ajaxfunc = execLib.ajaxexec('classify')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  updateClass(classify) {
    return this.ajaxfunc('editOneClass', classify);
  }
}
