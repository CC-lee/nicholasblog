import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class MessageService {
  ajaxfunc = execLib.ajaxexec('message')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }
  getTemp() {
    return this.ajaxfunc('getMessageTemp', null);
  }

  getAdminLists() {
    return this.ajaxfunc('adminMessageList', null);
  }

  getUserLists() {
    return this.ajaxfunc('userMessageList', null);
  }

  getAdminMessage(id) {
    return this.ajaxfunc('getAdminMessage', { _id: id });
  }

  createLoadImage(data) {
    return this.ajaxfunc('createLoadImage', data);
  }

  getComments(id) {
    return this.ajaxfunc('backAllComments', { message_id: id });
  }
}