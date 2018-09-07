import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ImageCreateService {

  ajaxfunc = execLib.ajaxexec('album')

  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  uploadImage(image) {
    return this.ajaxfunc('imageCreate', image);
  }

  updateTemp(temp) {
    return this.ajaxfunc('imageTemp', temp);
  }

  deleteImage(image) {
    return this.ajaxfunc('deleteImage', image);
  }
}
