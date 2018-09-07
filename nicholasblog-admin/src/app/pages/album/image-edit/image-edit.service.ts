import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ImageEditService {

  ajaxfunc = execLib.ajaxexec('album')
  
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  updateImage(image) {
    return this.ajaxfunc('editOneImage', image);
  }

  deleteImage(image) {
    return this.ajaxfunc('deleteImage', image);
  }

}
