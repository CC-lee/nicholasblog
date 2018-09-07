import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ShopService } from '../shop.service';

@Injectable()
export class ShopManageService {

  constructor(
    private http: Http,
    private shopService: ShopService
  ) { }

  smartTableData = [];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 0);
    });
  }

  getLists() { // 获取文章列表数据
    this.shopService.getLists().subscribe(
      res => {
        if (res.code == 401) {
          alert(res.message);
        } else {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].main_img = `<img src="${res.data[i].main_img}" width="200" height="100">`;
          }
          this.smartTableData = res.data;
        }
      },
      err => {
        alert('后台错误');
      }
    );
  }

}
