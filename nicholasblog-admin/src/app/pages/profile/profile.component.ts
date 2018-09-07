import { Component, OnInit, ViewChild, DoCheck, OnDestroy } from '@angular/core';
import { GlobalState } from '../../global.state';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ProfileService } from './profile.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { execLib } from 'execlib';
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit, DoCheck, OnDestroy {

  @ViewChild('dropzone') componentRef: DropzoneComponent;
  @ViewChild('dropzone') directiveRef: DropzoneDirective;

  public conferg: DropzoneConfigInterface;

  constructor(
    private _state: GlobalState,
    private service: ProfileService,
    private router: Router,
    public auth: AuthService
  ) {
    this.dateid = `${Date.now()}`;
  }

  profile = {
    _id: '',
    admin_name: '',
    gender: '',
    email: '',
    avatar: '',
  };

  password = '';

  repeatPassword = '';

  arr = [];

  avatar = [];

  drawArr = [];

  draw: boolean = true;

  finish: boolean = false;

  updateEnable: boolean = false;

  status = '';

  dateid = '';

  statusMethods = {
    passwordUpdate: function () {
      if (this.avatar.length > 0) {
        Object.assign(this.profile, { avatar: this.avatar[0].url });
      } else if (this.avatar.length == 0 && this.arr.length == 0) {
        Object.assign(this.profile, { avatar: `${execLib.filePrefix}admin/default/Kostya.jpg` });
      }
      Object.assign(this.profile, { password: this.password });
      this.profile.dateid = this.dateid
      execLib.uploadexec.call(this,
        this.service.modifyProfile(this.profile),
        function (res) {
          this.auth.avatarChange = true;
          if (res.token) {
            localStorage.setItem(execLib.tokenName, res.token);
          }
          this.router.navigate([`/pages/article/articlemanage`]);
        },
        null,
        null
      )
    },
    nonPasswordUpdate: function () {
      if (this.avatar.length > 0) {
        Object.assign(this.profile, { avatar: this.avatar[0].url });
      } else if (this.avatar.length == 0 && this.arr.length == 0) {
        Object.assign(this.profile, { avatar: `${execLib.filePrefix}admin/default/Kostya.jpg` });
      }
      this.profile.dateid = this.dateid
      execLib.uploadexec.call(this,
        this.service.modifyProfile(this.profile),
        function (res) {
          this.auth.avatarChange = true;
          if (res.token) {
            localStorage.setItem(execLib.tokenName, res.token);
          }
          this.router.navigate([`/pages/article/articlemanage`]);
        },
        null,
        null
      )
    }
  }

  subscription = this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.finish = true;
      }
    });



  ngOnInit() {
    const that = this;
    this.adminProfile();
    this.conferg = {
      url: `${execLib.apiName}admin/editSaveImage`,
      maxFiles: 1,
      dictDefaultMessage: '',
      previewsContainer: '#dropzone-previews',
      thumbnailWidth: 1500,
      thumbnailHeight: 1500,
      autoQueue: false,
      clickable: ['#input'],
      headers: {
        'Authorization': localStorage.getItem(execLib.tokenName)
      },
      previewTemplate: `
      <div class="preview col-md-5">
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
        $('.dropzone').hide();
        $('.dz-message').hide();
        $('.dz-default').css({ 'display': 'none' });
        $('#dropzone-previews').hide();
        this.on('addedfile', function (file) {
          $('#dropzone-previews').show();
          $('.dz-remove').hide();
          $('.preview').css({ 'display': 'inline-block', 'padding': '0px 10px', 'margin': '5px 0px' });
          if (that.arr.length > 0) {
            that.arr.push(file);
            this.removeFile(file);
          } else {
            that.arr.push(file);
          }
        });
        this.on('thumbnail', function () {
          $('.img img').css({ 'height': '190px', 'padding': '0 0' });
          $('.dz-remove').css({
            'display': 'inline-block',
            'position': 'absolute',
            'top': '3%',
            'left': '85%',
            'width': '1.3em',
            'height': '1.3em',
            'z-index': '0',
            'font-size': '1.3em',
            'line-height': '1em',
            'text-align': 'center',
            'font-weight': 'bold',
            'border': '1px solid black',
            'border-radius': '1.3em',
            'color': 'white',
            'background-color': 'black',
            'cursor': 'pointer',
          });
        });
        this.on('success', function (file, response) {
          $('.uploadprogress').hide();
          $('.dz-error-message').hide();
          that.avatar.push(response.data);
          that.statusMethods[that.status].call(that)
        });
        this.on('removedfile', function (file) {
          const index = _.findIndex(that.avatar, { filename: file.filename });
          that.avatar.splice(index, 1);
          that.arr.pop();
        });
        this.on('complete', function (file) { });
      }
    };
  }

  loadImage() {
    this.service.eidtLoadImage().subscribe(
      res => {
        if (res.code == 401) {
          alert(res.message);
        } else {
          if (res.data.length > 0) {
            this.avatar.push(res.data[0]);
            this.drawArr.push(res.data[0]);
          }
        }
      },
      err => {
        alert('后台错误');
      }
    );
  }

  adminProfile() {
    this.service.adminProfile().subscribe(
      res => {
        Object.assign(this.profile, res.profile);
        this.loadImage();
      },
      err => {
        alert('后台错误');
      }
    );
  }

  modifyProfile() {
    this.componentRef.directiveRef.dropzone.options.headers.dateid = this.dateid;
    if (this.password.length > 0) {
      if (this.password != this.repeatPassword) {
        alert('密码不一致');
      } else if (this.password.length < 4) {
        alert('密码必须大于5位');
      } else {
        this.status = 'passwordUpdate';
        this.updateEnable = false
        if (this.componentRef.directiveRef.dropzone.getAcceptedFiles().length > 0) {
          this.componentRef.directiveRef.dropzone.enqueueFiles(
            this.componentRef.directiveRef.dropzone.getAcceptedFiles()
          )
        } else {
          this.statusMethods[this.status].call(this)
        }
      }
    } else {
      this.status = 'nonPasswordUpdate';
      this.updateEnable = false
      if (this.componentRef.directiveRef.dropzone.getAcceptedFiles().length > 0) {
        this.componentRef.directiveRef.dropzone.enqueueFiles(
          this.componentRef.directiveRef.dropzone.getAcceptedFiles()
        )
      } else {
        this.statusMethods[this.status].call(this)
      }
    }
  }

  cancleUpload() {
    this.router.navigate([`/pages/article/articlemanage`]);
  }

  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '账号资料' });
  }

  ngDoCheck() {
    this.selectAndNotify();
    if (this.drawArr.length > 0 && this.draw == true) {
      this.componentRef.directiveRef.dropzone.emit('addedfile', this.avatar[0]);
      if (this.arr.length > 0) {
        this.componentRef.directiveRef.dropzone.emit('thumbnail', this.avatar[0], this.avatar[0].url);
        this.componentRef.directiveRef.dropzone.emit('complete', this.avatar[0]);
        this.draw = false;
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
