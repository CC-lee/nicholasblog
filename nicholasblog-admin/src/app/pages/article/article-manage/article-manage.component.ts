import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from '../../../components/ng2-smart-table';
import { ArticleManageService } from './article-manage.service';
import { ArticleService } from '../service/article.service';
import { CellsService } from '../../../components/ng2-smart-table/components/tbody/cells/cells.service';
import { execLib } from 'execlib';
@Component({
  selector: 'app-article-manage',
  templateUrl: './article-manage.component.html',
  styleUrls: ['./article-manage.component.scss'],
  providers: [ArticleManageService]
})
export class ArticleManageComponent implements OnInit {

  settings = {
    actions: {
      columnTitle: '操作',
      add: true,
      edit: true,
      read: true,
      comment: true,
      delete: true,
      position: 'left'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      addurl: '/pages/article/articlecreate'
    },
    edit: {
      editButtonContent: '<i class="ion-edit">编辑</i>',
      editurl: '/pages/article/articleedit',
      idName: 'article_id'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a">删除</i>',
      deleteurl: `${execLib.apiName}article/articledelete`,
      idName: 'article_id',
      confirmDelete: true
    },
    read: {
      readButtonContent: '<i class=" fa fa-book">查看</i>',
      readurl: `${execLib.hostFrontMainPath}article`,
      idName: 'article_id'
    },
    comment: {
      commentButtonContent: '<i class=" fa fa-comment">评论</i>',
      commenturl: '/pages/article/articlecomment',
      idName: 'article_id'
    },
    columns: {
      title: {
        title: '文章题目',
        type: 'string',
        width: '300px'
      },
      classify: {
        title: '分类名称',
        type: 'string',
        width: '300px'
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
    private service: ArticleManageService,
    private servicer: ArticleService,
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
