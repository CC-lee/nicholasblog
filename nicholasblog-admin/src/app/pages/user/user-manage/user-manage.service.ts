import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';
@Injectable()
export class UserManageService {

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

  getLists() { // 获取用户列表数据
    execLib.getexec.call(this,
      this.userService.userList(),
      function (res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].user_avatar = `<img src="${res.data[i].user_avatar}" width="200" height="100">`;
        }
        this.smartTableData = res.data;
      },
      null
    )
  }
}