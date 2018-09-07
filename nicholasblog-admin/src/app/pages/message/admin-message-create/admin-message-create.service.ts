import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class AdminMessageCreateService {
  ajaxfunc = execLib.ajaxexec('message')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  uploadMessage(message) {
    return this.ajaxfunc('adminMessageCreate', message);
  }

  updateTemp(temp) {
    return this.ajaxfunc('messageTemp', temp);
  }

  deleteImage(image) {
    return this.ajaxfunc('deleteImage', image);
  }
}