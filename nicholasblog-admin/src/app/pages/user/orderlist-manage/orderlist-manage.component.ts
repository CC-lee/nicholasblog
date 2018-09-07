import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from '../../../components/ng2-smart-table';
import { OrderlistManageService } from './orderlist-manage.service';
import { UserService } from '../user.service';
import { CellsService } from '../../../components/ng2-smart-table/components/tbody/cells/cells.service';
import { execLib } from 'execlib';

@Component({
  selector: 'app-orderlist-manage',
  templateUrl: './orderlist-manage.component.html',
  styleUrls: ['./orderlist-manage.component.scss'],
  providers: [OrderlistManageService]
})
export class OrderlistManageComponent implements OnInit {

  settings = {
    actions: {
      columnTitle: '操作',
      add: false,
      edit: true,
      read: false,
      comment: false,
      delete: false,
      position: 'left'
    },
    edit: {
      editButtonContent: '<i class="ion-edit">编辑</i>',
      editurl: '/pages/user/orderlistedit',
      idName: '_id'
    },
    columns: {
      user_name: {
        title: '用户名',
        type: 'string'
      },
      total_price: {
        title: '总价($)',
        type: 'string'
      },
      create_date: {
        title: '成交日期',
        type: 'string'
      },
    }
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: OrderlistManageService,
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
