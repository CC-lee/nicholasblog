import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { LocalDataSource } from '../../../components/ng2-smart-table';
import { ClassManageService } from './class-manage.service';
import { ClassService } from '../class.service';
import { CellsService } from '../../../components/ng2-smart-table/components/tbody/cells/cells.service';
import { classManageLib } from './class-managelib';
import { execLib } from 'execlib';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { concatMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-class-manage',
  templateUrl: './class-manage.component.html',
  styleUrls: ['./class-manage.component.scss'],
  providers: [ClassManageService]
})
export class ClassManageComponent implements OnInit {
  @Output() open: EventEmitter<any> = new EventEmitter();

  settings = {
    actions: {
      columnTitle: '操作',
      add: true,
      edit: true,
      delete: true,
      read: true,
      comment: false,
      position: 'left'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      addurl: '/pages/class/classcreate'
    },
    edit: {
      editButtonContent: '<i class="ion-edit">编辑</i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      editurl: '/pages/class/classedit',
      idName: '_id'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a">删除</i>',
      deleteurl: `${execLib.apiName}classify/removeClass`,
      idName: '_id',
      confirmDelete: true
    },
    read: {
      readButtonContent: '<i class=" fa fa-book">查看</i>',
      readurl: `${execLib.hostFrontMainPath}tags`,
      idName: '_id'
    },
    columns: {
      classify: {
        title: '分类名称',
        type: 'string',
        width: '300px'
      },
      create_date: {
        title: '创建日期',
        type: 'string'
      },
      update_date: {
        title: '修改日期',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  //exe$ = execLib.proxyListen(this, 'data/lay1/lay2/exe')


  constructor(
    private router: Router,
    private service: ClassManageService,
    private classService: ClassService,
    private cellsService: CellsService
  ) {
    execLib.proxyListen(this.service, 'smartTableData')
      .subscribe(x => {
        this.getData();
      })
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      this.cellsService.change();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {
    this.getLists();
    //this.getData();
    //this.data$.unsubscribe()
  }

  getData() {
    this.open.emit(classManageLib.getData.apply(this))
  }

  getLists() {
    this.service.getLists();
  }
}
