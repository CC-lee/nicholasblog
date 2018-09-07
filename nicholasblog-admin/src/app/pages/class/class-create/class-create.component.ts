import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { ClassCreateService } from './class-create.service';
import { ClassService } from '../class.service';
import { Router } from '@angular/router';
import { classCreateLib } from './class-createlib';
import { execLib } from 'execlib';
import { Observable } from 'rxjs/Observable';
import { Subject, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { defer } from 'rxjs/observable/defer';
import { concatMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-class-create',
  templateUrl: './class-create.component.html',
  styleUrls: ['./class-create.component.scss'],
  providers: [ClassCreateService]
})
export class ClassCreateComponent implements OnInit {

  @ViewChild('multiClassText') multiClassTextArea;

  classify = {
    classify: ''
  };

  clases = [];

  arrs: Observable<any> = defer((): any => {
    return this.clases
  })

  clases$ = execLib.proxyListen(this, 'clases').subscribe(x => {
    //console.log(this.clases);
  })
  constructor(
    private router: Router,
    private classService: ClassService,
    private service: ClassCreateService

  ) {

  }

  ngOnInit() {
    this.getClassify();
  }


  public gets(event): void {
    var id = event.target.id;
    var parent = event.target.parentElement.id;
    switch (true) {
      case id === 'uploadClass' || parent === 'uploadClass':
        this.uploadClass();
        break;
      case id === 'cancleUpload' || parent === 'cancleUpload':
        this.cancleUpload();
        break;
      case id === 'uploadMultiClass' || parent === 'uploadMultiClass':
        this.uploadMultiClass();
        break;
    }
  }

  public uploadClass(): void {
    var key = this.classify.classify.replace(/(\s|&nbsp;|<p.*?>|<\/p>)/g, "")
    if (key) {
      var index = _.findIndex(this.clases, {
        classify: key
      });
      if (index > -1) {
        alert('该分类已存在')
      } else {
        this.classify.classify = key;
        execLib.uploadexec.call(this,
          this.service.uploadClass(this.classify),
          function () { this.router.navigate([`/pages/class/classmanage`]) },
          null
        )
      }
    } else {
      alert('内容不能为空')
    }
  }

  public uploadMultiClass(): void {
    var unique = function (arr) {
      var res = [];
      var json = {};
      for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
          res.push(arr[i]);
          json[arr[i]] = 1;
        }
      }
      return res;
    }
    var textArray = this.multiClassTextArea.nativeElement.value.replace(/\n+/g, "\n").split(/\n/)
    var multiClass = [];
    for (var i = 0; i < textArray.length - 1; i++) {
      var word = textArray[i].replace(/\s+/g, "")
      if (word) {
        var index = _.findIndex(this.clases, {
          classify: word
        });
        if (index < 0) {
          multiClass.push(word);
        }
      }
    }
    multiClass = unique(multiClass);
    if (multiClass.length > 0) {
      execLib.uploadexec.call(this,
        this.service.uploadMultiClass({ multiClass: multiClass }),
        function () { this.router.navigate([`/pages/class/classmanage`]) },
        null
      )
    } else {
      alert('内容不能为空或输入分类已存在')
    }
  }


  public getClassify(): void {
    execLib.getexec.call(this,
      this.classService.getLists(),
      function (res) {
        this.clases = res.data;
      },
      null
    )
  }

  public cancleUpload(): void {
    this.router.navigate([`/pages/class/classmanage`]);
  }
}
