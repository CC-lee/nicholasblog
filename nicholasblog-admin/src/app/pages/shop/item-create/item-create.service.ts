import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ItemCreateService {
  ajaxfunc = execLib.ajaxexec('shop')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  uploadItem(item) {
    return this.ajaxfunc('itemCreate', item);
  }

  updateTemp(temp) {
    return this.ajaxfunc('shopTemp', temp);
  }

  deleteImage(image) {
    return this.ajaxfunc('deleteImage', image);
  }
}
