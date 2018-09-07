import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';

@Injectable()
export class OrderlistManageService {

  constructor(
    private http: Http,
    private userService: UserService
  ) { }
  smartTableData = [];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 0);
    });
  }

  getLists() { // 获取订单列表数据
    execLib.getexec.call(this,
      this.userService.getOderlists(),
      function (res) {
        this.smartTableData = res.data;
      },
      null
    )
  }

}