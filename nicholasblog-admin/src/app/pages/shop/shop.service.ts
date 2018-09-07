import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ShopService {
  ajaxfunc = execLib.ajaxexec('shop')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  getTemp() {
    return this.ajaxfunc('getShopTemp', null)
  }

  getLists() {
    return this.ajaxfunc('shopInfo', null)
  }

  getOneItem(id) {
    return this.ajaxfunc('backOneItem', { _id: id })
  }

  createLoadImage(data) {
    return this.ajaxfunc('createLoadImage', data)
  }

  eidtLoadImage(data): Observable<any> {
    return this.ajaxfunc('editLoadImage', data);
  }
}