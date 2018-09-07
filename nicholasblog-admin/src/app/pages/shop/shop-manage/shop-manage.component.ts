import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from '../../../components/ng2-smart-table';
import { ShopManageService } from './shop-manage.service';
import { ShopService } from '../shop.service';
import { CellsService } from '../../../components/ng2-smart-table/components/tbody/cells/cells.service';
import { execLib } from 'execlib';

@Component({
  selector: 'app-shop-manage',
  templateUrl: './shop-manage.component.html',
  styleUrls: ['./shop-manage.component.scss'],
  providers: [ShopManageService]
})
export class ShopManageComponent implements OnInit {

  settings = {
    actions: {
      columnTitle: '操作',
      add: true,
      edit: true,
      delete: true,
      read: false,
      comment: false,
      position: 'left'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      addurl: '/pages/shop/itemcreate'
    },
    edit: {
      editButtonContent: '<i class="ion-edit">编辑</i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      editurl: '/pages/shop/itemedit',
      idName: 'item_id'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a">删除</i>',
      deleteurl: `${execLib.apiName}shop/deleteItem`,
      idName: 'item_id',
      confirmDelete: true
    },
    columns: {
      main_img: {
        title: '商品图片',
        type: 'html'
      },
      item_name: {
        title: '商品名称',
        type: 'string'
      },
      unit_price: {
        title: '商品单价',
        type: 'string'
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

  constructor(
    private service: ShopManageService,
    private classService: ShopService,
    private cellsService: CellsService
  ) {
    execLib.proxyListen(this.service, 'smartTableData')
      .subscribe(
      x => {
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
