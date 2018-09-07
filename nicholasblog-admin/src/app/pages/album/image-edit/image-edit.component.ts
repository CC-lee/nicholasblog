import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ImageEditService } from './image-edit.service';
import { GlobalState } from '../../../global.state';
import { AlbumService } from '../album.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { imageEditLib } from './image-editlib';
import { Image } from './image-editlib';
import { execLib } from 'execlib';

declare var $: any;

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss'],
  providers: [
    ImageEditService
  ]
})
export class ImageEditComponent implements OnInit, DoCheck {

  public options: Object;

  textLength = 0;

  image: Image = {
    _id: '',
    image_content: '',
    text_content: '',
    image_info: '',
    image_preview: ''
  };

  constructor(
    private _state: GlobalState,
    private router: Router,
    private service: ImageEditService,
    private albumService: AlbumService,
    private activatedRoute: ActivatedRoute
  ) {
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
    this.selectAndNotify();
    this.activatedRoute.params.subscribe(res => {
      this.getOneImage(res.id);
    });
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
        'froalaEditor.charCounter.update': function (e, editor) {
          that.textLength = editor.charCounter.count();
        }
      }
    };
  }

  getOneImage(id) {
    imageEditLib.getexec.call(this,
      this.albumService.getOneImage(id),
      function (res) {
        const { _id, image_content, text_content } = res.data;
        Object.assign(this.image, { _id, image_content, text_content });
        $('#pic').attr({ 'src': this.image.image_content, 'height': '500px', 'width': '100%' });
      }
    )
  }

  updateImage() {
    if (this.textLength == 0) {
      alert('文字内容不能为空');
    } else {
      this.image.text_content = this.image.text_content.replace(/<p.*?>/g, '<p>').replace(/(<p><br><\/p>)+/g, '<br>');
      imageEditLib.uploadexec.call(this,
        this.service.updateImage(this.image),
        function () {
          this.router.navigate([`/pages/album/albummanage`]);
        },
        null,
        null
      )
    }
  }

  cancleUpdate() {
    this.router.navigate([`/pages/album/albummanage`]);
  }


  selectAndNotify() {
    this._state.notifyDataChanged('menu.activeLink', { title: '图片编辑' });
  }

  ngDoCheck() {
    this.selectAndNotify();
  }
}
