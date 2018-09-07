import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ItemEditService {
  ajaxfunc = execLib.ajaxexec('shop')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  updateItem(item) {
    return this.ajaxfunc('editOneItem', item);
  }

  deleteImage(image) {
    return this.ajaxfunc('deleteImage', image);
  }

}
