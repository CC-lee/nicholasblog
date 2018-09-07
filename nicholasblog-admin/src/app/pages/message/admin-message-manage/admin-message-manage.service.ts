import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../message.service';
import { execLib } from 'execlib';

@Injectable()
export class AdminMessageManageService {
  constructor(
    private http: Http,
    private messageService: MessageService
  ) { }

  smartTableData = [];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 0);
    });
  }

  getLists() { // 获取管理留言列表数据
    execLib.getexec.call(this,
      this.messageService.getAdminLists(),
      function (res) {
        this.smartTableData = res.data;
      },
      null
    )
  }

}
