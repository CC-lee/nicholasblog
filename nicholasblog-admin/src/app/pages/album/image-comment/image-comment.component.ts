import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { ImageCommentService } from './image-comment.service';
import { AlbumService } from '../album.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { execLib } from 'execlib';
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-image-comment',
  templateUrl: './image-comment.component.html',
  styleUrls: ['./image-comment.component.scss'],
  providers: [
    ImageCommentService
  ]
})
export class ImageCommentComponent implements OnInit {

  comments = [];

  mainid = '';

  constructor(
    private _state: GlobalState,
    private service: ImageCommentService,
    private albumService: AlbumService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  getComments(id) {
    execLib.getexec.call(this,
      this.albumService.getComments(id),
      function (res) {
        this.comments = res.data;
      }
    )
  }

  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '图片评论' });
  }

  ngOnInit() {
    this.selectAndNotify();
    this.activatedRoute.params.subscribe(res => {
      this.getComments(res.id);
      this.mainid = res.id;
    });
  }

}
