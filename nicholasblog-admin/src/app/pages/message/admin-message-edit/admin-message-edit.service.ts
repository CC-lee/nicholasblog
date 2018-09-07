import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class AdminMessageEditService {
  ajaxfunc = execLib.ajaxexec('message')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  updateMessage(message) {
    return this.ajaxfunc('editAdminMessage', message);
  }

}
