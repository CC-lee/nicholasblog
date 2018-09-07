import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';

@Injectable()
export class CellsService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'Authorization': localStorage.getItem(execLib.tokenName)
  });

  private options = new RequestOptions({ headers: this.headers });

  success = false;

  constructor(private http: Http) { }

  delete(link, id) {
    if (this.success === true) {
      return this.http.post(`${link}`, { objectId: id, _id: id }, this.options).map(res => res.json()).subscribe(
        res => {
          alert(res.message);
        },
        err => {
          alert('后台错误');
        },
      );
    }
  }
  change() {
    this.success = true;
  }
}
