import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ClassService } from '../class.service';
import { execLib } from 'execlib';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable()
export class ClassManageService {

  public smartTableData = [];
  public smartTableData$ = new Subject()

  constructor(
    private classService: ClassService
  ) {

  }



  public getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 0);
    });
  }

  public getLists() {
    execLib.getexec.call(this,
      this.classService.getLists(),
      function (res) {
        this.smartTableData = res.data;
        //this.smartTableData$.next(res.data)
      },
      null
    )
  }
}
