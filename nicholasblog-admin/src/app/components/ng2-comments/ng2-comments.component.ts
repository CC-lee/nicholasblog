import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { Ng2CommentsService } from './ng2-comments.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from "lodash";

@Component({
  selector: 'ng2-comments',
  templateUrl: './ng2-comments.component.html',
  styleUrls: [
    './ng2-comments.component.scss',
    './lib/style.scss',
    './lib/comment.scss'
  ],
  providers: [
    Ng2CommentsService
  ]
})

export class Ng2CommentsComponent implements OnInit, DoCheck {

  @Input() comments: Array<Object> = [];
  @Input() type: String = '';
  @Input() itemid: String = '';
  @Input() name: String = '';

  commentarray = [];

  show = false;

  commentsCode = '';

  async getCode() {
    await this.service.getCommentsCode(this.commentarray)
    var commentsCode = this.service.commenthtml;
    this.commentsCode = `${commentsCode}`
    this.show = true
  }

  constructor(
    private service: Ng2CommentsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const that = this;
    $('.commentAll').on('click', '.removeBlock', function () {
      if (confirm("是否删除评论及相关回复") == true) {
        var oT = $(this).parents('.date-dz-right').parents('.date-dz').parents('.all-pl-con');
        var time = $(this).parents('.date-dz-right').parents('.date-dz').find('.comment-time').html();
        var target = _.find(that.commentarray, { time: time });
        var deleteinfo = {
          [`${that.name}_id`]: that.itemid,
          comment_id: target._id
        }
        that.service.deleteOneComment(deleteinfo, that.type).subscribe(
          res => {
            if (res.code == 200) {
              if (oT.siblings('.all-pl-con').length >= 1) {
                oT.remove();
              } else {
                $(this).parents('.date-dz-right').parents('.date-dz').parents('.all-pl-con').parents('.hf-list-con').css('display', 'none')
                oT.remove();
              }
              $(this).parents('.date-dz-right').parents('.date-dz').parents('.comment-show-con-list').parents('.comment-show-con').remove();
            }
          },
          err => {
            alert('后台错误');
          }
        )
      }
    })
  }
  ngDoCheck() {
    if (this.comments.length > 0 && this.show == false) {
      this.commentarray = _.cloneDeep(this.comments);
      this.getCode()
    }
  }

}
