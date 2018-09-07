import { Component, OnInit, ViewChild, DoCheck, OnDestroy } from '@angular/core';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AdminMessageCreateService } from './admin-message-create.service';
import { MessageService } from '../message.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth.service';
import { execLib } from 'execlib';
import dropzoneset from './dropzoneset';
import { froalaset } from './frolaset';
declare var $: any;
import * as _ from 'lodash';

var MacroCommand = function () {
  var commandsList = [];
  return {
    add: function (command) {
      commandsList.push(command);
    },
    execute: function () {
      for (var i = 0, command; command = commandsList[i++];) {
        command.execute.apply(this);
      }
    }
  }
};

@Component({
  selector: 'app-admin-message-create',
  templateUrl: './admin-message-create.component.html',
  styleUrls: [
    './admin-message-create.component.scss',
    '../../../lib/dropzone.css'
  ],
  providers: [AdminMessageCreateService]
})
export class AdminMessageCreateComponent implements OnInit, DoCheck, OnDestroy {

  @ViewChild('droper') componentRef: DropzoneComponent;
  @ViewChild('droper') directiveRef: DropzoneDirective;

  @ViewChild('updateTemp') updateTempButton;
  @ViewChild('uploadMessage') uploadMessageButton;

  public config: DropzoneConfigInterface;
  public conferg: DropzoneConfigInterface;

  public options: Object;

  show: boolean = false;

  arr = [];

  textLength = 0;

  dateid = '';

  finish: boolean = false;

  messageTemp = {
    img: [],
    content: '',
    notify: []
  };

  img = [];

  drawArr = [];

  draw: boolean = true;

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

  updateEnable = function () {
    var element: any = [];
    return {
      add: function (elem) {
        element.push(elem)
      },
      enable: function () {
        element[0].disabled = false
        element[1].disabled = false
      },
      disable: function () {
        element[0].disabled = true
        element[1].disabled = true
      }
    }
  }();

  status = '';

  uploadError = {
    boolean: false,
    message: ''
  }

  statusMethods = {
    save: function () {
      this.messageTemp.dateid = this.dateid
      if (this.img.length > 0) {
        this.messageTemp.img = [];
        for (var i = 0, len = this.img.length; i < len; i++) {
          const filename = this.img[i].filename
          this.messageTemp.img.push(filename)
        }
      }
      execLib.uploadexec.call(this,
        this.service.updateTemp(this.messageTemp),
        function () {
          this.updateEnable.enable();
        },
        function () {
          this.updateEnable.enable();
        },
        function () {
          this.updateEnable.enable();
        }
      )
    },
    upload: function () {
      this.message.dateid = this.dateid
      for (var i = 0, len = this.img.length; i < len; i++) {
        const filename = this.img[i].filename
        this.message.img.push(filename)
      }
      execLib.uploadexec.call(this,
        this.service.uploadMessage(this.message),
        function () {
          this.router.navigate([`/pages/message/adminmessagemanage`]);
        },
        function () {
          this.updateEnable.enable();
        },
        function () {
          this.updateEnable.enable();
        }
      )
    }
  }

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

  macroCommand = MacroCommand();

  listenFunc = {
    drawlisten: {
      execute: function () {
        if (this.drawArr.length > 0 && this.draw == true) {
          for (let x = 0; x < this.img.length; x++) {
            this.componentRef.directiveRef.dropzone.emit('addedfile', this.img[x]);
            this.componentRef.directiveRef.dropzone.emit('thumbnail', this.img[x], this.img[x].url);
            this.componentRef.directiveRef.dropzone.emit('complete', this.img[x]);
          }
          this.draw = false;
        }
      }
    },
    textlisten: {
      execute: function () {
        if (this.textLength > 200) {
          $('#count').css({ 'color': 'red', 'font-weight': 'bold', 'font-size': '150%' });
          $('#update').prop('disabled', true);
          $('#upload').prop('disabled', true);
        }
        if (this.textLength <= 200) {
          $('#count').css({ 'color': 'white', 'font-weight': 'normal', 'font-size': '100%' });
          $('#update').prop('disabled', false);
          $('#upload').prop('disabled', false);
        }
      }
    }
  }


  subscription = this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.finish = true;
      }
    });

  constructor(
    private service: AdminMessageCreateService,
    private messageService: MessageService,
    private router: Router,
    public auth: AuthService
  ) {
    this.dateid = `${Date.now()}`;
    //this.macroCommand.add(this.listenFunc.drawlisten);
    this.macroCommand.add(this.listenFunc.textlisten);
  }

  ngOnInit() {
    const that = this;
    this.updateEnable.add(this.updateTempButton.nativeElement);
    this.updateEnable.add(this.uploadMessageButton.nativeElement);
    this.loadImage();
    this.getTemp();
    this.auth.getProfile();
    this.macroCommand.add(this.listenFunc.drawlisten);
    this.macroCommand.add(this.listenFunc.textlisten);
    this.config = {
      url: `${execLib.apiName}message/createSaveImage`,
      uploadMultiple: true,
      clickable: ["#input"],
      maxFiles: 4,
      parallelUploads: 100,
      dictDefaultMessage: '',
      dictCancelUpload: '取消上传',
      previewsContainer: '#dropzone-previews',
      thumbnailWidth: 1500,
      thumbnailHeight: 1500,
      autoQueue: false,
      headers: {
        'Authorization': localStorage.getItem(execLib.tokenName)
      },
      previewTemplate: `
      <div class="preview col-md-3">
      <div class="img">
        <img class="col-md-12" data-dz-thumbnail />
        <div class="dz-remove" data-dz-remove>
        <div class="fa fa-close" ></div>
      </div>
      <div>
        <div class="uploadprogress"><span data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>
      </div>
      `,
      init: function () {
        $('.dz-message').hide();
        $('.dz-default').css({ 'display': 'none' });
        $('#dropzone-previews').hide();
        this.on('drop', function (file) {
        });
        this.on('sending', function (file, response) {
        });
        this.on('addedfile', function (file) {
          $('#dropzone-previews').show();
          $('.dz-remove').hide();
          $('.preview').css({ 'display': 'inline-block', 'padding': '0px 10px', 'margin': '5px 0px' });
          if (that.arr.length === 4) {
            that.arr.push(file);
            this.removeFile(file);
          } else {
            that.arr.push(file);
          }
        });
        this.on('processing', function () {
        });
        this.on('uploadprogress', function () {
        });
        this.on('maxfilesreached', function (file, response) {
        });
        this.on('maxfilesexceeded', function (file, response) {
        });
        this.on("successmultiple", function (files, response) {
          if (response.code == 200) {
            for (var i = 0, len = response.data.length; i < len; i++) {
              that.img.push(response.data[i]);
            }
            for (var i = 0, len = files.length; i < len; i++) {
              files[i].path = response.data[i].path
            }
            if (that.img.length == that.arr.length) {
              that.statusMethods[that.status].call(that)
              that.componentRef.directiveRef.dropzone.files = [];
            }
          } else {
            if (response.code == 401) {
              that.uploadError.boolean = true;
              that.uploadError.message = response.message;
            }
            alert(response.message)
          }
        });
        this.on('thumbnail', function () {
          $('.img img').css({ 'height': '190px', 'padding': '0 0' });
          $('.dz-remove').css(dropzoneset.removeclass);
        });
        this.on('removedfile', function (file) {
          if (that.finish == false) {
            if (file.path) {
              if (that.uploadError.boolean) {
                alert(that.uploadError.message)
              } else {
                const index = _.findIndex(that.img, { filename: file.filename });
                that.img.splice(index, 1);
                file.dateid = that.dateid;
                execLib.deletexec.call(that,
                  that.service.deleteImage(file),
                  null,
                  function (res) {
                    that.uploadError.boolean = true;
                    that.uploadError.message = res.message;
                  },
                  null
                )
              }
            }
          }
          that.arr.pop();
          $('.dz-remove').css(dropzoneset.removeclass);
          if (that.arr.length === 0) {
            $('#dropzone-previews').hide();
          }
        });
        this.on('complete', function (file) {
        });
      }
    };
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
      emoticonsSet: froalaset.emoticonsSet,
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

  public gets(event): void {
    var id = event.target.id;
    var parent = event.target.parentElement.id
    function exec(fn) {
      if (this.uploadError.boolean) {
        alert(this.uploadError.message)
      }else{
        fn.apply(this);
      }
    }
    switch (true) {
      case id == 'updateTemp' || parent == 'updateTemp':
        exec.call(this, this.updateTemp);
        break;
      case id == 'uploadMessage' || parent == 'uploadMessage':
        exec.call(this, this.uploadMessage);
        break;
      case id == 'cancleUpload' || parent == 'cancleUpload':
        this.cancleUpload();
        break;
    }
  }

  public loadImage(): void {
    execLib.getexec.call(this,
      this.messageService.createLoadImage({ dateid: this.dateid }),
      function (res) {
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.img.push(res.data[i]);
            this.drawArr.push(res.data[i]);
          }
        }
        this.updateEnable.enable()
      },
      null
    )
  }

  public getTemp(): void {
    execLib.getexec.call(this,
      this.messageService.getTemp(),
      function (res) {
        const { _id, content } = res.data[0];
        Object.assign(this.messageTemp, { _id, content });
      },
      null,
      null
    )
  }

  public updateTemp(): void {
    this.componentRef.directiveRef.dropzone.options.paramName = function () { return 'images'; };
    this.componentRef.directiveRef.dropzone.options.headers.dateid = this.dateid;
    this.messageTemp.content = this.messageTemp.content.replace(/<p.*?>/g, '<p>').replace(/(<p><br><\/p>)+/g, '<br>');
    this.status = 'save';
    this.updateEnable.disable();
    if (this.componentRef.directiveRef.dropzone.getAcceptedFiles().length > 0) {
      this.componentRef.directiveRef.dropzone.enqueueFiles(
        this.componentRef.directiveRef.dropzone.getAcceptedFiles()
      )
    } else {
      this.statusMethods[this.status].call(this)
    }
  }

  public uploadMessage(): void {
    this.componentRef.directiveRef.dropzone.options.headers.dateid = this.dateid;
    const str = this.messageTemp.content.replace(/\s/g, '');
    let choseName = this.messageTemp.content.match(/<span class="atwho-inserted" data-atwho-at-query="@">(.*?)<\/span>/ig);
    if (str.length > 0) {
      const { _id, admin_name, avatar } = this.auth.profile;
      this.messageTemp.content = this.messageTemp.content.replace(/<p.*?>/g, '<p>').replace(/(<p><br><\/p>)+/g, '<br>');
      Object.assign(this.message, this.messageTemp);
      Object.assign(this.message, {
        user_id: _id,
        user_name: admin_name,
        user_avatar: avatar
      });
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
      this.status = 'upload';
      this.updateEnable.disable()
      if (this.componentRef.directiveRef.dropzone.getAcceptedFiles().length > 0) {
        this.componentRef.directiveRef.dropzone.enqueueFiles(
          this.componentRef.directiveRef.dropzone.getAcceptedFiles()
        )
      } else {
        this.statusMethods[this.status].call(this)
      }
    } else {
      alert('文字内容不能为空');
    }
  }

  public cancleUpload(): void {
    this.router.navigate([`/pages/message/adminmessagemanage`]);
  }

  ngDoCheck() {
    if (this.arr.length < 4) {
      this.show = false;
    }
    if (this.arr.length === 4) {
      this.show = true;
    }
    this.macroCommand.execute.apply(this)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
