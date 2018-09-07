import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ClassCreateService {
  ajaxfunc = execLib.ajaxexec('classify')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  uploadClass(classify) {
    return this.ajaxfunc('classCreate', classify);
  }

  uploadMultiClass(data){
    return this.ajaxfunc('classMultiCreate', data);
  }
}
