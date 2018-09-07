import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from '../../../components/ng2-smart-table';
import { UserManageService } from './user-manage.service';
import { UserService } from '../user.service';
import { CellsService } from '../../../components/ng2-smart-table/components/tbody/cells/cells.service';
import { execLib } from 'execlib';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss'],
  providers: [UserManageService]
})
export class UserManageComponent implements OnInit {

  settings = {
    actions: {
      columnTitle: '操作',
      add: false,
      edit: false,
      read: false,
      comment: false,
      delete: true,
      position: 'left'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a">删除</i>',
      deleteurl: `${execLib.apiName}user/deleteUser`,
      idName: '_id',
      confirmDelete: true
    },
    columns: {
      user_avatar: {
        title: '头像图片',
        type: 'html'
      },
      user_name: {
        title: '用户名',
        type: 'string'
      },
      gender: {
        title: '性别',
        type: 'string'
      },
      location: {
        title: '地区',
        type: 'string'
      },
      create_date: {
        title: '注册日期',
        type: 'string'
      },
    }
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: UserManageService,
    private servicer: UserService,
    private cellsService: CellsService
  ) {
    execLib.proxyListen(this.service, 'smartTableData')
      .subscribe(
      x => {
        this.getData();
      }
      )
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
  }

  getData() {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

  getLists() {
    this.service.getLists();
  }

}
