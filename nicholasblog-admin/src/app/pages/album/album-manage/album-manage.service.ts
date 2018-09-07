import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlbumService } from '../album.service';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';

interface ImageInfo {
  [index: number]: {
    image_id: string,
    image_info: string,
    comment_num: number,
    like_num: number,
    timestamp: number,
    update_date: string,
    create_date: string,
    _id: string
  }
}

@Injectable()
export class AlbumManageService {

  constructor(
    private http: Http,
    private albumService: AlbumService
  ) { }

  smartTableData = [];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 0);
    });
  }

  getLists() { // 获取相册列表数据
    execLib.getexec.call(this,
      this.albumService.getLists(),
      function (res) {
        var len = res.data.length
        for (let i = 0; i < len; i++) {
          res.data[i].image_info = `<img src="${res.data[i].image_info}">`;
        }
        this.smartTableData = res.data;
      }
    )
  }
}
