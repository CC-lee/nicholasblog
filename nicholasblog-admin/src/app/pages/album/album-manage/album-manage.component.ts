import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from '../../../components/ng2-smart-table';
import { AlbumManageService } from './album-manage.service';
import { AlbumService } from '../album.service';
import { CellsService } from '../../../components/ng2-smart-table/components/tbody/cells/cells.service';
import { execLib } from 'execlib';

@Component({
  selector: 'app-album-manage',
  templateUrl: './album-manage.component.html',
  styleUrls: ['./album-manage.component.scss'],
  providers: [
    AlbumManageService
  ]
})
export class AlbumManageComponent implements OnInit {
  settings = {
    actions: {
      columnTitle: '操作',
      add: true,
      edit: true,
      delete: true,
      read: false,
      comment: true,
      position: 'left'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      addurl: '/pages/album/imagecreate'
    },
    edit: {
      editButtonContent: '<i class="ion-edit">编辑</i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      editurl: '/pages/album/imageedit',
      idName: 'image_id'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a">删除</i>',
      deleteurl: `${execLib.apiName}album/imageDelete`,
      idName: 'image_id',
      confirmDelete: true
    },
    comment: {
      commentButtonContent: '<i class=" fa fa-comment">评论</i>',
      commenturl: '/pages/album/imagecomment',
      idName: 'image_id'
    },
    columns: {
      image_info: {
        title: '相册图片',
        type: 'html'
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
      },
      update_date: {
        title: '修改日期',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: AlbumManageService,
    private albumService: AlbumService,
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
