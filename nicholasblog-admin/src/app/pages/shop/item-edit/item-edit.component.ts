import { Component, OnInit, ViewChild, DoCheck, OnDestroy } from '@angular/core';
import { DropzoneModule, DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { GlobalState } from '../../../global.state';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { ItemEditService } from './item-edit.service';
import { ShopService } from '../shop.service';
import { SelectItemComponent } from '../components/selectItem/selectItem.component'
import { execLib } from 'execlib';
import { editCreateLib } from './item-editlib';
import { Item } from './item-editlib';
import { Option } from './item-editlib';
declare var $: any;
import * as _ from 'lodash';

class SelectItem {
  kind: Array<string> = ['自定义种类', '颜色'];
  colorObj: Object = function () {
    var colorArr: Array<string> = ['pink', 'blue', 'red', 'orange', 'yellow', 'green', 'purple', 'cyan', 'brown', 'white'];
    var colorObj = {}
    for (var i = 0; i < colorArr.length; i++) {
      colorObj[`${colorArr[i]}`] = {
        id: `${colorArr[i]}`,
        num: i,
        show: false
      }
    }
    return colorObj
  }();
  category: string = '';
  selectKind = {
    category: false,
    color: false,
    choice: '自定义种类'
  };
  item_option = {
    select: '',
    kindOption: {
      name: '',
      kind: []
    },
    colorName: '',
    colorOption: []
  };
  constructor() { }
  change(event) {
    if (event.target.checked) {
      this.item_option.colorOption.push(this.colorObj[event.target.value]);
      this.item_option.colorOption = _.sortBy(this.item_option.colorOption, ['num']);
    } else {
      const index = _.findIndex(this.item_option.colorOption, { 'id': event.target.value });
      this.item_option.colorOption.splice(index, 1);
    }
  }
}

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss',
    '../../../lib/dropzone.css'],
  providers: [ItemEditService, SelectItem]
})
export class ItemEditComponent implements OnInit, DoCheck, OnDestroy {

  @ViewChild('droper') componentRef: DropzoneComponent;
  @ViewChild('droper') directiveRef: DropzoneDirective;

  @ViewChild('updateItem') updateItemButton;

  public config: DropzoneConfigInterface;
  public options: Object;

  item: Item = {
    objectId: '',
    _id: '',
    item_id: '',
    item_name: '',
    unit_price: 0,
    item_img: [],
    item_detail: '',
    item_option: [],
    preview_img: [],
    main_img: ''
  };

  show: boolean = false;

  dateid = '';

  selectShow = false;

  selectItems = [];

  selectNumberShow: boolean = true;

  arr = [];

  selects: number = 0;

  finish: boolean = false;

  item_option: Array<{
    select: '',
    kindOption: {},
    colorName: '',
    colorOption: Array<{
      id: string,
      num: number,
      show: false
    }>
  }> = [];

  item_img = [];

  drawArr = [];

  draw: boolean = true;

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
      },
      disable: function () {
        element[0].disabled = true
      }
    }
  }();

  statusMethods = {
    update: function () {
      this.item.objectId = this.item._id
      this.item.dateid = this.dateid
      Object.assign(this.item, { item_option: this.item_option });
      this.item.item_img = [];
      for (let i = 0; i < this.item_img.length; i++) {
        this.item.item_img.push(this.item_img[i].filename.filename);
        this.item.preview_img.push(this.item_img[i].filename.thumbname);
      }
      Object.assign(this.item, { main_img: Object.assign(this.item_img[0].filename, this.item_img[0].path) });
      execLib.uploadexec.call(this,
        this.service.updateItem(this.item),
        function () {
          this.router.navigate([`/pages/shop/shopmanage`]);
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

  subscription = this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.finish = true;
      }
    });

  constructor(
    private _state: GlobalState,
    private router: Router,
    private service: ItemEditService,
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute
  ) {
    this.dateid = `${Date.now()}`;
  }

  ngOnInit() {
    this.selectAndNotify();
    this.updateEnable.add(this.updateItemButton.nativeElement);
    this.activatedRoute.params.subscribe(res => {
      this.getOneItem(res.id);
      this.loadImage(res.id);
    });
    const that = this;
    this.config = {
      url: `${execLib.apiName}shop/editSaveImage`,
      uploadMultiple: true,
      maxFiles: 4,
      previewsContainer: '#dropzone-previews',
      thumbnailWidth: 1500,
      thumbnailHeight: 1500,
      parallelUploads: 100,
      autoQueue: false,
      headers: {
        'Authorization': localStorage.getItem(execLib.tokenName)
      },
      previewTemplate: `
      <div class='preview col-md-6'>
      <div class='img'>
        <img class='col-md-12' data-dz-thumbnail />
        <div class='dz-remove' data-dz-remove>
        <div class='fa fa-close' ></div>
        </div>
      <div>
        <div class='uploadprogress'><span data-dz-uploadprogress></span></div>
        <div class='dz-error-message'><span data-dz-errormessage></span></div>
      </div>
      `,
      init: function () {
        $('.dropzone').css({ 'overflow': 'hidden', 'height': '500px', 'z-index': '0' });
        $('.dz-message').css({ 'background': 'none', 'border': 'none', 'position': 'relative' });
        $('.dz-text').css({ 'font-size': '30px', 'color': 'black', 'margin-top': '100px', 'line-height': '150%' });
        this.on('addedfile', function (file) {
          $('#dropzone-previews').css({ 'display': 'block', 'height': '500px', 'background-color': '#5FA3D6' });
          $('.dz-message').hide();
          $('.dz-remove').hide();
          $('.preview').css({ 'display': 'inline-block', 'padding': '10px 10px' });
          if (that.arr.length === 4) {
            that.arr.push(file);
            this.removeFile(file);
          } else {
            that.arr.push(file);
          }
        });
        this.on('thumbnail', function () {
          $('.img img').css({ 'padding': '0px 0px', 'height': '230px' });
          $('.dz-remove').css(editCreateLib.removeclass);
        });
        this.on("error", function (file, errorMessage, errorsMessage) {
        });
        this.on("successmultiple", function (files, response) {
          if (response.code == 200) {
            for (var i = 0, len = response.data.length; i < len; i++) {
              that.item_img.push(response.data[i]);
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
        })
        this.on('removedfile', function (file) {
          if (that.finish == false) {
            if (file.path) {
              if (that.uploadError.boolean) {
                alert(that.uploadError.message)
              } else {
                const index = _.findIndex(that.item_img, { filename: file.filename });
                that.item_img.splice(index, 1);
                file.path.dateid = that.dateid;
                file.path.objectId = that.item._id;
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
          that.arr.pop();
          $('.dz-message').css({ 'background': 'none', 'border': 'none', 'position': 'relative' });
          $('.drop.dz-message').css({ 'height': '400px' });
          $('.dz-remove').css(editCreateLib.removeclass);
          if (that.arr.length === 0) {
            $('.dz-message').show();
            $('#dropzone-previews').hide();
          }
        });
        this.on('complete', function (file) {

        });
      }
    };
    this.options = {
      editorClass: 'text',
      heightMin: 250,
      emoticonsStep: 10,
      placeholderText: '在此写下商品介绍',
      pastePlain: true,
      charCounterCount: true,
      toolbarSticky: false,
      pluginsEnabled: ['url', 'emoticons', 'link', 'lists'],
      toolbarButtons: ['emoticons', 'insertLink', 'formatOL', 'formatUL'],
      toolbarButtonsXS: ['emoticons', 'insertLink', 'formatOL', 'formatUL'],
      toolbarButtonsSM: ['emoticons', 'insertLink', 'formatOL', 'formatUL'],
      toolbarButtonsMD: ['emoticons', 'insertLink', 'formatOL', 'formatUL'],
      emoticonsSet: editCreateLib.emoticonsSet
    };
  }

  public gets(event): void {
    var id = event.target.id;
    var parent = event.target.parentElement.id;
    function exec(fn) {
      if (this.uploadError.boolean) {
        alert(this.uploadError.message)
      } else {
        fn.apply(this);
      }
    }
    switch (true) {
      case id == 'updateItem' || parent == 'updateItem':
        exec.call(this, this.updateItem);
        break;
      case id == 'cancleUpdate' || parent == 'cancleUpdate':
        this.cancleUpdate();
        break;
      case id == 'selectNumber' || parent == 'selectNumber':
        this.selectNumber(event);
        break;
      case id == 'reset' || parent == 'reset':
        this.reset();
        break;
    }
  }

  selectNumber(e) {
    if (e) {
      e.preventDefault && e.preventDefault();
    }
    if (this.selects <= 0) {
      alert('选择项数量必须是正整数');
    } else if (this.selects > 3) {
      alert('最大选择项数量为3');
    } else {
      for (var i = 0; i < this.selects; i++) {
        this.selectItems.push(new SelectItem())
      }
      if (this.selectItems.length == this.selects) {
        this.selectShow = true;
        this.selectNumberShow = false;
      }
    }
  }

  reset() {
    this.selectShow = false;
    this.selectNumberShow = true;
    this.selectItems = [];
    this.item_option = [];
  }

  public loadImage(id): void {
    execLib.getexec.call(this,
      this.shopService.eidtLoadImage(
        {
          objectId: id,
          dateid: this.dateid
        }),
      function (res) {
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.item_img.push(res.data[i]);
            this.drawArr.push(res.data[i]);
          }
        }
        this.updateEnable.enable()
      },
      null,
      null
    )
  }

  getOneItem(id) {
    execLib.getexec.call(this,
      this.shopService.getOneItem(id),
      function (res) {
        const that = this;
        const { _id, item_name, unit_price, item_detail, item_option } = res.data;
        Object.assign(this.item, { _id, item_name, unit_price, item_detail, item_option });
        if (item_option && item_option.length > 0) {
          const num = item_option.length;
          var options: Option = item_option;
          this.selects = num;
          this.selectNumber();
          for (var i = 0; i < num; i++) {
            this.selectItems[i].selectKind.choice = options[i].select;
            this.selectItems[i].category = options[i].kindOption.kind.join(',');
            Object.assign(this.selectItems[i].item_option, options[i])
            options[i].colorOption.map(function (color) {
              that.selectItems[i].colorObj[color.id].show = true;
            })
          }
        }
      },
      null
    )
  }

  Judge(selectItem, status) {
    if (selectItem.selectKind.category === true) {
      const ars = selectItem.category.split(/,|，/);
      if (ars.slice(-1)[0] === '') {
        alert('种类定义结尾必须是文字');
        this.updateEnable.enable();
      } else {
        selectItem.item_option.kindOption.kind = ars;
        this.item_option.push(selectItem.item_option)
        status.push(selectItem);
      }
    }
    if (selectItem.selectKind.color === true) {
      if (selectItem.item_option.colorOption.length === 0) {
        alert('颜色选项不能为空');
        this.updateEnable.enable();
      } else {
        this.item_option.push(selectItem.item_option)
        status.push(selectItem);
      }
    }
  }

  updateItem() {
    this.componentRef.directiveRef.dropzone.options.headers.objectId = this.item._id;
    this.componentRef.directiveRef.dropzone.options.headers.dateid = this.dateid;
    let statusArray = [];
    if (this.item.item_name.replace(/(^s*)|(s*$)/g, '').length == 0) {
      alert('商品名称不能为空');
    } else if (this.item.unit_price.replace(/(^s*)|(s*$)/g, '').length == 0) {
      alert('商品单价不能为空');
    } else if (isNaN(Number(this.item.unit_price))) {
      alert('商品单价必须为数字');
    } else if (this.item.item_detail.replace(/(^s*)|(s*$)/g, '').length == 0) {
      alert('商品介绍不能为空');
    } else if (this.arr.length == 0) {
      alert('图片框不能为空');
    } else {
      this.status = 'update';
      this.updateEnable.disable();
      if (this.selectNumberShow === false) {
        for (var i = 0; i < this.selectItems.length; i++) {
          this.Judge(this.selectItems[i], statusArray)
        }
        if (statusArray.length === this.selectItems.length) {
          if (this.componentRef.directiveRef.dropzone.getAcceptedFiles().length > 0) {
            this.componentRef.directiveRef.dropzone.enqueueFiles(
              this.componentRef.directiveRef.dropzone.getAcceptedFiles()
            )
          } else {
            this.statusMethods[this.status].call(this)
          }
        }
      } else {
        if (this.componentRef.directiveRef.dropzone.getAcceptedFiles().length > 0) {
          this.componentRef.directiveRef.dropzone.enqueueFiles(
            this.componentRef.directiveRef.dropzone.getAcceptedFiles()
          )
        } else {
          this.statusMethods[this.status].call(this)
        }
      }
    }
  }

  cancleUpdate() {
    this.router.navigate([`/pages/shop/shopmanage`]);
  }

  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '商品编辑' });
  }


  ngDoCheck() {
    if (this.arr.length < 4) {
      this.show = false;
    }
    if (this.arr.length === 4) {
      this.show = true;
    }
    if (this.drawArr.length > 0 && this.draw == true) {
      for (let x = 0; x < this.item_img.length; x++) {
        this.componentRef.directiveRef.dropzone.emit('addedfile', this.item_img[x]);
        this.componentRef.directiveRef.dropzone.emit('thumbnail', this.item_img[x], this.item_img[x].url.url);
        this.componentRef.directiveRef.dropzone.emit('complete', this.item_img[x]);
      }
      this.draw = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
