import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { ClassEditService } from './class-edit.service';
import { ClassService } from '../class.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { execLib } from 'execlib';
import * as _ from 'lodash';

@Component({
  selector: 'app-class-edit',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.scss'],
  providers: [ClassEditService]
})
export class ClassEditComponent implements OnInit {

  classify = {
    _id: '',
    classify: ''
  };

  clases = [];

  constructor(
    private _state: GlobalState,
    private router: Router,
    private service: ClassEditService,
    private classService: ClassService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.selectAndNotify();
    this.getClassify();
    this.activatedRoute.params.subscribe(res => {
      this.getOneClass(res.id);
    });
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

  getOneClass(id) {
    execLib.getexec.call(this,
      this.classService.getOneClass(id),
      function (res) {
        const { _id, classify } = res.data;
        Object.assign(this.classify, { _id, classify });
        document.title = `${this.classify.classify} -分类编辑`
      },
      null
    );
  }

  updateClass() {
    var key = this.classify.classify.replace(/(\s|&nbsp;|<p.*?>|<\/p>)/g, "")
    if (key) {
      var index = _.findIndex(this.clases, {
        classify: key
      });
      if (index > -1 && this.clases[index]._id !== this.classify._id) {
        alert('该分类已存在')
      } else {
        this.classify.classify = key;
        execLib.uploadexec.call(this,
          this.service.updateClass(this.classify),
          function () {
            this.router.navigate([`/pages/class/classmanage`]);
          },
          null
        )
      }
    } else {
      alert('内容不能为空')
    }
  }
  cancleUpdate() {
    this.router.navigate([`/pages/class/classmanage`]);
  }

  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '分类编辑' });
  }
}
