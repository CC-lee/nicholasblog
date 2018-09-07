import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { execLib } from 'execlib';


@Injectable()
export class AlbumService {

  ajaxfunc = execLib.ajaxexec('album')

  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  getTemp() {
    return this.ajaxfunc('getImageTemp', null)
  }

  getLists() {
    return this.ajaxfunc('albumInfo', null)
  }

  getOneImage(id) {
    return this.ajaxfunc('backOneImage', { _id: id })
  }

  createLoadImage(data) {
    return this.ajaxfunc('createLoadImage', data)
  }

  getComments(id) {
    return this.ajaxfunc('backAllComments', { image_id: id })
  }

}
