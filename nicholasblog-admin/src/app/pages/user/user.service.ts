import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { execLib } from 'execlib';


@Injectable()
export class UserService {

  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  ajaxfunc(address: string, param: any) {
   return execLib.ajaxexec('user').apply(this, arguments)
  }

  ajaxfuncorder(address: string, param: any) {
    return execLib.ajaxexec('shop').apply(this, arguments)
   }

  userList() {
    return this.ajaxfunc('userList', null);
  }

  getOderlists() {
    return this.ajaxfuncorder('userOrderList', null);
  }
  /**
   * @param  {string} id 订单id号
   * @returns Observable
   */
  getOrder(id: string) {
    return this.ajaxfuncorder('getOneOrder', { _id: id });
  }

}