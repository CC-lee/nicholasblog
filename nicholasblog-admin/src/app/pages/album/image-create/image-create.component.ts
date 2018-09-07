import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ImageCreateService } from './image-create.service';
import { AlbumService } from '../album.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { imageCreateLib } from './image-createlib';
import { execLib } from 'execlib';
import { Image } from './image-createlib';
import dropzoneset from './dropzoneset';
import { froalaset } from './frolaset';
declare var $: any;
import * as _ from 'lodash';


@Component({
  selector: 'app-image-create',
  templateUrl: './image-create.component.html',
  styleUrls: [
    './image-create.component.scss',
    '../../../lib/dropzone.css'
  ],
  providers: [
    ImageCreateService
  ]
})
export class ImageCreateComponent implements OnInit, OnDestroy {
  @ViewChild('droper') componentRef: DropzoneComponent;
  @ViewChild('droper') directiveRef: DropzoneDirective;

  @ViewChild('updateTemp') updateTempButton;
  @ViewChild('uploadImage') uploadImageButton;

  public config: DropzoneConfigInterface;
  public options: Object;

  arr = [];

  textLength = 0;

  dateid = '';

  imageTemp = {
    dateid: '',
    image_content: '',
    text_content: '',
  };

  image: Image = {
    _id: '',
    image_content: '',
    text_content: '',
    like_status: false,
    like_num: 0,
    comment_num: 0,
    image_info: '',
    image_preview: ''
  };

  image_content = [];

  drawArr = [];

  draw: boolean = true;

  finish: boolean = false;

  status = '';

  uploadError = {
    boolean: false,
    message: ''
  }

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

  statusMethods = {
    save: function () {
      this.imageTemp.dateid = this.dateid
      if (this.image_content[0]) {
        const { filename } = this.image_content[0].filename
        Object.assign(this.imageTemp, {
          image_content: filename,
        })
      }
      execLib.uploadexec.call(this,
        this.service.updateTemp(this.imageTemp),
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
      this.image.dateid = this.dateid
      if (this.image_content[0]) {
        const { filename, thumbname, infoname } = this.image_content[0].filename
        Object.assign(this.image, {
          image_content: filename,
          image_info: infoname,
          image_preview: thumbname
        });
      }
      execLib.uploadexec.call(this,
        this.service.uploadImage(this.image),
        function () {
          this.router.navigate([`/pages/album/albummanage`]);
        },
        function () {
          this.updateEnable.enable();
        },
        function () {
          this.updateEnable.enable();
        }
      )
    }
  };


  subscription = this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.finish = true;
      }
    });



  constructor(
    private service: ImageCreateService,
    private albumService: AlbumService,
    private router: Router
  ) {
    this.dateid = `${Date.now()}`;
    execLib.proxyListen(this, 'drawArr').subscribe(x => {
      this.componentRef.directiveRef.dropzone.emit('addedfile', this.image_content[0]);
      if (this.arr.length > 0) {
        this.componentRef.directiveRef.dropzone.emit('thumbnail', this.image_content[0], this.image_content[0].url.url);
        this.componentRef.directiveRef.dropzone.emit('complete', this.image_content[0]);
        this.draw = false;
      }
    })
    execLib.proxyListen(this, 'textLength').subscribe(x => {
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
    })
  }

  ngOnInit() {
    const that = this;
    this.updateEnable.add(this.updateTempButton.nativeElement);
    this.updateEnable.add(this.uploadImageButton.nativeElement);
    this.config = {
      url: `${execLib.apiName}album/createSaveImage`,
      maxFiles: 1,
      previewsContainer: '#drop-previews',
      thumbnailWidth: 1500,
      thumbnailHeight: 1500,
      uploadMultiple: true,
      autoQueue: false,
      parallelUploads: 100,
      dictDefaultMessage: 'hello',
      headers: {
        Authorization: localStorage.getItem(execLib.tokenName)
      },
      previewTemplate: `
      <div class="preview col-md-12">
      <div class="img">
        <img class="col-md-12" data-dz-thumbnail />
        <div class="dz-remove" data-dz-remove>
          <div class="fa fa-close"></div>
        </div>
        <div>
          <div class="uploadprogress">
            <span data-dz-uploadprogress></span>
          </div>
          <div class="dz-error-message">
            <span data-dz-errormessage></span>
          </div>
        </div>
       </div>
     </div>
      `,
      init: function () {
        $('.dropzone').css({ 'overflow': 'hidden', 'height': '450px', 'z-index': '0' });
        $('.dz-text').css({ 'font-size': '30px', 'color': 'black', 'margin-top': '100px', 'line-height': '150%' });
        $('.dz-message').css({ 'background': 'none', 'border': 'none' });
        this.on('addedfile', function (file) {
          $('.dz-message').hide();
          $('.dz-remove').hide();
          $('.preview').css({ 'padding': '0px 0px', 'margin': '0px 0px' });
          if (that.arr.length > 0) {
            that.arr.push(file);
            this.removeFile(file);
          } else {
            that.arr.push(file);
          }
        });
        this.on('thumbnail', function () {
          $('.img img').css({ 'height': '450px', 'padding': '0px 0px' });
          $('.dz-remove').css(dropzoneset.removeclass);
        });
        this.on("successmultiple", function (files, response) {
          if (response.code == 200) {
            for (var i = 0, len = response.data.length; i < len; i++) {
              that.image_content.push(response.data[i]);
            }
            for (var i = 0, len = files.length; i < len; i++) {
              files[i].path = response.data[i].path
            }
            that.statusMethods[that.status].call(that)
            that.componentRef.directiveRef.dropzone.files = [];
          } else {
            if (response.code == 401) {
              that.uploadError.boolean = true;
              that.uploadError.message = response.message;
            }
            alert(response.message)
          }
        });
        this.on('removedfile', function (file) {
          if (that.finish == false) {
            if (file.path) {
              if (that.uploadError.boolean) {
                alert(that.uploadError.message)
              } else {
                const index = _.findIndex(that.image_content, { filename: { filename: file.filename } });
                that.image_content.splice(index, 1);
                file.path.dateid = that.dateid;
                execLib.deletexec.call(that,
                  that.service.deleteImage(file.path),
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
          that.arr.shift();
          $('.dz-remove').css(dropzoneset.removeclass);
          if (that.arr.length === 0) {
            $('.dz-message').show();
          }
        });
        this.on('complete', function (file) { });
      }
    };
    this.loadImage();
    this.getTemp();
    this.options = {
      editorClass: 'text',
      heightMin: 150,
      emoticonsStep: 10,
      htmlAllowedEmptyTags: ['textarea', 'a', 'iframe', 'object', 'video', 'style', 'script', '.fa', 'p'],
      placeholderText: '在此写下文字内容',
      pastePlain: true,
      charCounterCount: true,
      pluginsEnabled: ['url', 'emoticons', 'link', 'charCounter', 'codeView'],
      toolbarButtons: ['emoticons', 'insertLink', 'html'],
      toolbarButtonsXS: ['emoticons', 'insertLink', 'html'],
      toolbarButtonsSM: ['emoticons', 'insertLink', 'html'],
      toolbarButtonsMD: ['emoticons', 'insertLink', 'html'],
      emoticonsSet: froalaset.emoticonsSet,
      events: {
        'froalaEditor.charCounter.update': function (e, editor) {
          that.textLength = editor.charCounter.count();
        }
      }
    };
  }

  public gets(event): void {
    var list = event.composedPath()
    var arrs = ['updateTemp', 'uploadImage', 'cancleUpload']
    for (var i = 0, len = list.length; i < len; i++) {
      if (arrs.indexOf(list[i].id) > -1) {
        var id = list[i].id
      }
    }
    function exec(fn) {
      if (this.uploadError.boolean) {
        alert(this.uploadError.message)
      } else {
        fn.apply(this);
      }
    }
    switch (true) {
      case id == 'updateTemp':
        exec.call(this, this.updateTemp)
        break;
      case id == 'uploadImage':
        exec.call(this, this.uploadImage)
        break;
      case id == 'cancleUpload':
        this.cancleUpload();
        break;
    }
  }



  public loadImage(): void {
    imageCreateLib.getexec.call(this,
      this.albumService.createLoadImage({ dateid: this.dateid }),
      function (res) {
        if (res.data.length > 0) {
          this.image_content.push(res.data[0]);
          this.drawArr.push(res.data[0]);

        }
        this.updateEnable.enable();
      },
      null,
      null
    )
  }

  public getTemp(): void {
    execLib.getexec.call(this,
      this.albumService.getTemp(),
      function (res) {
        const { _id, text_content } = res.data[0];
        Object.assign(this.imageTemp, { _id, text_content });
      },
      null,
      null
    )
  }


  updateTemp() {
    this.componentRef.directiveRef.dropzone.options.headers.dateid = this.dateid;
    if (this.arr.length == 0) {
      alert('图片框不能为空');
    } else if (this.textLength == 0) {
      alert('文字内容不能为空');
    } else {
      this.imageTemp.text_content = this.imageTemp.text_content.replace(/<p.*?>/g, '<p>').replace(/(<p><br><\/p>)+/g, '<br>');
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
  }

  uploadImage() {
    this.componentRef.directiveRef.dropzone.options.headers.dateid = this.dateid;
    if (this.arr.length == 0) {
      alert('图片框不能为空');
    } else if (this.textLength == 0) {
      alert('文字内容不能为空');
    } else {
      this.imageTemp.text_content = this.imageTemp.text_content.replace(/<p.*?>/g, '<p>').replace(/(<p><br><\/p>)+/g, '<br>');
      Object.assign(this.image, this.imageTemp);
      this.status = 'upload';
      this.updateEnable.disable();
      if (this.componentRef.directiveRef.dropzone.getAcceptedFiles().length > 0 && this.image_content.length == 0) {
        this.componentRef.directiveRef.dropzone.enqueueFiles(
          this.componentRef.directiveRef.dropzone.getAcceptedFiles()
        )
      } else {
        this.statusMethods[this.status].call(this)
      }
    }
  }

  cancleUpload() {
    this.router.navigate([`/pages/album/albummanage`]);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
