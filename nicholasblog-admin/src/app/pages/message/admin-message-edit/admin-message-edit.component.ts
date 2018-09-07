import { Component, OnInit, DoCheck } from '@angular/core';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AdminMessageEditService } from './admin-message-edit.service';
import { GlobalState } from '../../../global.state';
import { MessageService } from '../message.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { execLib } from 'execlib';
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-message-edit',
  templateUrl: './admin-message-edit.component.html',
  styleUrls: ['./admin-message-edit.component.scss'],
  providers: [AdminMessageEditService]
})
export class AdminMessageEditComponent implements OnInit, DoCheck {

  public options: Object;

  textLength = 0;

  message = {
    _id: '',
    user_id: '',
    user_name: '管理者',
    user_avatar: '',
    user_email: 'www.roman@163.com',
    message_type: 'admin',
    message_preview: '',
    img: [],
    comment_num: 0,
    like_num: 0,
    like_status: false,
    content: '',
    notify: []
  };

  img = [];

  draw: boolean = true;

  datasource = ['Jacob', 'Isabella', 'Ethan', 'Emma', 'Michael', 'Olivia'];

  userInfo = [{ name: 'Jacob', id: 1 },
  { name: 'Isabella', id: 2 },
  { name: 'Ethan', id: 3 },
  { name: 'Emma', id: 4 },
  { name: 'Michael', id: 5 },
  { name: 'Olivia', id: 6 }];

  names = $.map(this.datasource, function (value, i) {
    return {
      'id': i, 'name': value, 'email': value + '@email.com'
    };
  });

  configer = {
    at: '@',
    data: this.names,
    displayTpl: '<li>${name} <small>${email}</small></li>',
    limit: 200,
    callbacks: {
      remoteFilter: (query, callback) => {
        //console.log(query);
      }
    }
  };

  constructor(
    private _state: GlobalState,
    private service: AdminMessageEditService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const that = this;
    this.activatedRoute.params.subscribe(res => {
      this.getAdminMessage(res.id);
    });
    this.options = {
      editorClass: 'text',
      heightMin: 150,
      emoticonsStep: 10,
      placeholderText: '在此写下留言',
      pastePlain: true,
      charCounterCount: true,
      toolbarSticky: false,
      pluginsEnabled: ['url', 'emoticons', 'charCounter', 'link'],
      toolbarButtons: ['emoticons', 'insertLink'],
      toolbarButtonsXS: ['emoticons', 'insertLink'],
      toolbarButtonsSM: ['emoticons', 'insertLink'],
      toolbarButtonsMD: ['emoticons', 'insertLink'],
      emoticonsSet: [
        { code: '1f601', desc: 'grinning face with smiling eyes' },
        { code: '1f602', desc: 'face with tears of joy' },
        { code: '1f603', desc: 'smiling face with open mouth' },
        { code: '1f604', desc: 'smiling face with open mouth and smiling eyes' },
        { code: '1f605', desc: 'smiling face with open mouth and cold sweat' },
        { code: '1f606', desc: 'smiling face with open mouth and tightly-closed eyes' },
        { code: '1f609', desc: 'winking face' },
        { code: '1f60a', desc: 'smiling face with smiling eyes' },
        { code: '1f60b', desc: 'face savouring delicious food' },
        { code: '1f60c', desc: 'relieved face' },
        { code: '1f60d', desc: 'smiling face with heart-shaped eyes' },
        { code: '1f60f', desc: 'smirking face' },
        { code: '1f612', desc: 'unamused face' },
        { code: '1f613', desc: 'face with cold sweat' },
        { code: '1f614', desc: 'pensive face' },
        { code: '1f616', desc: 'confounded face' },
        { code: '1f618', desc: 'face throwing a kiss' },
        { code: '1f61a', desc: 'kissing face with closed eyes' },
        { code: '1f61c', desc: 'face with stuck-out tongue and winking eye' },
        { code: '1f61d', desc: 'face with stuck-out tongue and tightly-closed eyes' },
        { code: '1f61e', desc: 'disappointed face' },
        { code: '1f620', desc: 'angry face' },
        { code: '1f621', desc: 'pouting face' },
        { code: '1f622', desc: 'crying face' },
        { code: '1f623', desc: 'persevering face' },
        { code: '1f624', desc: 'face with look of triumph' },
        { code: '1f625', desc: 'disappointed but relieved face' },
        { code: '1f628', desc: 'fearful face' },
        { code: '1f629', desc: 'weary face' },
        { code: '1f62a', desc: 'sleepy face' },
        { code: '1f62b', desc: 'tired face' },
        { code: '1f62d', desc: 'loudly crying face' },
        { code: '1f630', desc: 'face with open mouth and cold sweat' },
        { code: '1f631', desc: 'face screaming in fear' },
        { code: '1f632', desc: 'astonished face' },
        { code: '1f633', desc: 'flushed face' },
        { code: '1f635', desc: 'dizzy face' },
        { code: '1f637', desc: 'face with medical mask' },
        { code: '1f638', desc: 'grinning cat face with smiling eyes' },
        { code: '1f639', desc: 'cat face with tears of joy' },
        { code: '1f63a', desc: 'smiling cat face with open mouth' },
        { code: '1f63b', desc: 'smiling cat face with heart-shaped eyes' },
        { code: '1f63c', desc: 'cat face with wry smile' },
        { code: '1f63d', desc: 'kissing cat face with closed eyes' },
        { code: '1f63e', desc: 'pouting cat face' },
        { code: '1f63f', desc: 'crying cat face' },
        { code: '1f640', desc: 'weary cat face' },
        { code: '1f645', desc: 'face with no good gesture' },
        { code: '1f646', desc: 'face with ok gesture' },
        { code: '1f647', desc: 'person bowing deeply' },
        { code: '1f648', desc: 'see-no-evil monkey' },
        { code: '1f649', desc: 'hear-no-evil monkey' },
        { code: '1f64a', desc: 'speak-no-evil monkey' },
        { code: '1f64b', desc: 'happy person raising one hand' },
        { code: '1f64c', desc: 'person raising both hands in celebration' },
        { code: '1f64d', desc: 'person frowning' },
        { code: '1f64e', desc: 'person with pouting face' },
        { code: '1f64f', desc: 'person with folded hands' },
        { code: '1f607', desc: 'smiling face with halo' },
        { code: '1f608', desc: 'smiling face with horns' },
        { code: '1f60e', desc: 'smiling face with sunglasses' },
        { code: '1f610', desc: 'neutral face' },
        { code: '1f611', desc: 'expressionless face' },
        { code: '1f615', desc: 'confused face' },
        { code: '1f617', desc: 'kissing face' },
        { code: '1f619', desc: 'kissing face with smiling eyes' },
        { code: '1f61b', desc: 'face with stuck-out tongue' },
        { code: '1f61f', desc: 'worried face' },
        { code: '1f626', desc: 'frowning face with open mouth' },
        { code: '1f627', desc: 'anguished face' },
        { code: '1f62c', desc: 'grimacing face' },
        { code: '1f62e', desc: 'face with open mouth' },
        { code: '1f62f', desc: 'hushed face' },
        { code: '1f634', desc: 'sleeping face' },
        { code: '1f636', desc: 'face without mouth' },
        { code: '1f911', desc: 'money-mouth face' },
      ],
      events: {
        'froalaEditor.initialized': function (e, editor) {
          editor.$el
            .atwho(that.configer)
            .on('inserted.atwho', function (atwho, $li, browser) {
              //console.log(browser.currentTarget.childNodes[0].nodeValue);
              editor.$el.find('.atwho-inserted').removeAttr('contenteditable');
            });
          editor.events.on('keydown', function (e) {
            if (e.which == $.FroalaEditor.KEYCODE.ENTER && editor.$el.atwho('isSelecting')) {
              //console.log(editor.$el.atwho('isSelecting'));
              return false;
            }
          }, true);
        },
        'froalaEditor.charCounter.update': function (e, editor) {
          that.textLength = editor.charCounter.count();
        }
      }
    };
  }

  getAdminMessage(id) {
    execLib.getexec.call(this,
      this.messageService.getAdminMessage(id),
      function (res) {
        const { _id, user_id, user_name, user_avatar, message_type, content, img, comment_num, like_num, like_status } = res.data;
        Object.assign(this.message, { _id, user_id, user_name, user_avatar, message_type, content, img, comment_num, like_num, like_status });
        for (let i = 0; i < img.length; i++) {
          img[i] = img[i].replace(/temp/g, _id);
        }
        this.img = img;
      },
      null
    )
  }

  updateAdminMessage() {
    const str = this.message.content.replace(/\s/g, '');
    let choseName = this.message.content.match(/<span class="atwho-inserted" data-atwho-at-query="@">(.*?)<\/span>/ig);
    if (str.length > 0) {
      this.message.content = this.message.content.replace(/<p.*?>/g, '<p>');
      this.message.content = this.message.content.replace(/(<p><br><\/p>)+/g, '<br>');
      this.message.message_preview = this.message.content
        .match(/<p(.*?)>([\s\S]*?)<\/p>/g)
        .join("")
        .replace(/(<([^>]+)>)/gi, "")
        .replace(/&nbsp;/ig, '')
        .substring(0, 30);
      if (choseName != null) {
        choseName = choseName.map(function (name) {
          name = name
            .replace(/<span class="atwho-inserted" data-atwho-at-query="@">@/g, '')
            .replace(/<\/span>/g, '');
          return name;
        });
        for (let i = 0; i < choseName.length; i++) {
          this.message.notify.push(_.find(this.userInfo, { name: choseName[i] }));
        }
      }
      execLib.uploadexec.call(this,
        this.service.updateMessage(this.message),
        function () {
          this.router.navigate([`/pages/message/adminmessagemanage`]);
        },
        null
      )
    } else {
      alert('文字内容不能为空');
    }
  }

  cancleUpdate() {
    this.router.navigate([`/pages/message/adminmessagemanage`]);
  }

  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '留言编辑' });
  }


  ngDoCheck() {
    this.selectAndNotify();
  }

}
