import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../pages/auth.service';
import { execLib } from 'execlib';

@Injectable()
export class Ng2CommentsService {

  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  commenthtml = '';

  comment(avatar, name, content, like_num, time) {
    var oHtml = `<div class="comment-show-con clearfix">
    <div class="comment-show-con-img pull-left">
      <img src="${avatar}" alt="" width="50" height="50">
    </div>
    <div class="comment-show-con-list pull-left clearfix">
      <div class="pl-text clearfix">
        <a href="#" class="comment-size-name">${name} : </a>
        <span class="my-pl-con">&nbsp;${content}</span>
      </div>
      <div class="date-dz">
        <span class="date-dz-left pull-left comment-time">${time}</span>
        <div class="date-dz-right pull-right comment-pl-block">
          <a href="javascript:;" class="removeBlock">删除</a>
          <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>
          <span class="pull-left date-dz-line">|</span>
          <a href="javascript:;" class="date-dz-z pull-left">
          <i class="date-dz-z-click-red"></i>赞 (
          <i class="z-num">${like_num} </i> )</a>
        </div>
      </div>
      <div class="hf-list-con"></div>
    </div>
    </div>
    `;
    return oHtml
  }

  commentreply(avatar, name, content, like_num, time, comment_reply) {
    var oHtml = `<div class="comment-show-con clearfix">
    <div class="comment-show-con-img pull-left">
      <img src="${avatar}" alt="" width="50" height="50">
    </div>
    <div class="comment-show-con-list pull-left clearfix">
      <div class="pl-text clearfix">
        <a href="#" class="comment-size-name">${name} : </a>
        <span class="my-pl-con">&nbsp;${content}</span>
      </div>
      <div class="date-dz">
        <span class="date-dz-left pull-left comment-time">${time}</span>
        <div class="date-dz-right pull-right comment-pl-block">
        <a href="javascript:;" class="removeBlock">删除</a>
        <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>
        <span class="pull-left date-dz-line">|</span>
        <a href="javascript:;" class="date-dz-z pull-left">
        <i class="date-dz-z-click-red"></i>赞 (
        <i class="z-num">${like_num} </i> )</a>
        </div>
      </div>
      <div class="hf-list-con">
       ${this.getReply(comment_reply)}
      </div>
    </div>
    </div>
    `;
    return oHtml
  }

  reply(avatar, name, content, time) {
    var oHtml = `<div class="all-pl-con">
    <div class="comment-show-con-img pull-left">
    <img src="${avatar}" alt="" width="50" height="50">
    </div>
    <div style="margin-left:60px">
    <div class="pl-text hfpl-text clearfix">
      <a href="#" class="comment-size-name">${name} : </a>
      <span class="my-pl-con">${content}</span>
    </div>
    <div class="date-dz"> 
      <span class="date-dz-left pull-left comment-time">${time}</span> 
    <div class="date-dz-right pull-right comment-pl-block"> 
      <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a> 
    </div> 
    </div>
  </div>
  </div>`;
    return oHtml
  }

  getReply(array) {
    var replyhtml = ''
    for (var i in array) {
      var oAt = `回复<a href="#" class="atName">@${array[i].reply_user_name}</a> : ${array[i].content}`;
      replyhtml = replyhtml + this.reply(array[i].user_avatar, array[i].user_name, oAt, array[i].time)
    }
    return replyhtml
  }

  getCommentsCode(array) {
    var commenthtml = '';
    for (var i in array) {
      if (array[i].comment_reply) {
        if (array[i].comment_reply.length == 0) {
          this.commenthtml = this.commenthtml + this.comment(array[i].user_avatar, array[i].user_name, array[i].content, array[i].like_num, array[i].time)
        } else {
          this.commenthtml = this.commenthtml + this.commentreply(array[i].user_avatar, array[i].user_name, array[i].content, array[i].like_num, array[i].time, array[i].comment_reply)
        }
      } else {
        this.commenthtml = this.commenthtml + this.comment(array[i].user_avatar, array[i].user_name, array[i].content, array[i].like_num, array[i].time)
      }
    }
  }

  deleteOneComment(deleteinfo, type): Observable<any> {
    return this.http.post(`${execLib.apiName}${type}/deleteOneComment`, deleteinfo, this.auth.headerSet()).map(res => res.json());
  }

}