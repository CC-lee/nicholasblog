import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class OrderlistEditService {

  constructor(
    private http: Http,
    public auth: AuthService
  ) { }
  ajaxfunc(address: string, param: any) {
    return execLib.ajaxexec('shop').apply(this, arguments)
  }

  updateOrder(order) {
    return this.ajaxfunc('editUserOrder', order);
  }

}