import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from '../../../components/ng2-smart-table';
import { UserMessageManageService } from './user-message-manage.service';
import { MessageService } from '../message.service';
import { CellsService } from '../../../components/ng2-smart-table/components/tbody/cells/cells.service';
import { execLib } from 'execlib';
@Component({
  selector: 'app-user-message-manage',
  templateUrl: './user-message-manage.component.html',
  styleUrls: ['./user-message-manage.component.scss'],
  providers: [UserMessageManageService]
})
export class UserMessageManageComponent implements OnInit {

  settings = {
    actions: {
      columnTitle: '操作',
      add: false,
      edit: false,
      delete: true,
      read: false,
      comment: true,
      position: 'left'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a">删除</i>',
      deleteurl: `${execLib.apiName}message/messageDelete`,
      idName: 'mix_id',
      confirmDelete: true
    },
    comment: {
      commentButtonContent: '<i class=" fa fa-comment">评论</i>',
      commenturl: '/pages/message/messagecomment',
      idName: 'message_id'
    },
    columns: {
      user_name: {
        title: '用户名',
        type: 'string'
      },
      comment_num: {
        title: '评论数',
        type: 'string'
      },
      like_num: {
        title: '赞数',
        type: 'string'
      },
      create_date: {
        title: '创建日期',
        type: 'string'
      }
    }
  };


  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: UserMessageManageService,
    private messageService: MessageService,
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

  getLists() {
    this.service.getLists();
  }

  getData() {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }


}
