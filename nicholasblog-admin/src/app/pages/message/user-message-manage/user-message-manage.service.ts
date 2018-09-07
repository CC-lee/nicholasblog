import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../message.service';
import { execLib } from 'execlib';
@Injectable()
export class UserMessageManageService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'charset': 'UTF-8'
  });
  private options = new RequestOptions({ headers: this.headers });
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

  getLists() { // 获取留言列表数据
    execLib.getexec.call(this,
      this.messageService.getUserLists(),
      function (res) {
        this.smartTableData = res.data;
      },
      null
    )
  }
}
