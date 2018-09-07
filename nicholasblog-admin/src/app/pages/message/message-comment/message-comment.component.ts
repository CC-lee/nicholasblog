import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { MessageCommentService } from './message-comment.service';
import { MessageService } from '../message.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { execLib } from 'execlib';

@Component({
  selector: 'app-message-comment',
  templateUrl: './message-comment.component.html',
  styleUrls: ['./message-comment.component.scss'],
  providers: [
    MessageCommentService
  ]
})
export class MessageCommentComponent implements OnInit {

  comments = [];

  mainid = '';

  constructor(
    private _state: GlobalState,
    private service: MessageCommentService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  getComments(id) {
    this.messageService.getComments(id).subscribe(
      res => {
        this.comments = res.comments;
      }
    )
  }

  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '留言评论' });
  }

  ngOnInit() {
    this.selectAndNotify();
    this.activatedRoute.params.subscribe(res => {
      this.getComments(res.id);
      this.mainid = res.id;
    });
  }

}
