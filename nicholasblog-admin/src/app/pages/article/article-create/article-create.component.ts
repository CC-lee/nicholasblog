import { Component, OnInit, OnDestroy, HostListener, ViewChild, DoCheck, ElementRef } from '@angular/core';
import { ArticleCreateService } from './article-create.service';
import { ArticleService } from '../service/article.service';
import { Router } from '@angular/router';
import froalaset from './froalaset';
import { articleCreateLib } from './article-createlib';
import { Article } from './article-createlib';
import { execLib } from 'execlib';
import { CompleterCmp, CompleterService, CompleterData, CompleterItem, RemoteData } from 'ng2-completer';
import * as _ from 'lodash';

declare var $: any;

interface Temp {
  _id: string;
  title: string;
  content: string;
  classify: string;
}

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.scss'],
  providers: [
    ArticleCreateService
  ]
})

export class ArticleCreateComponent implements OnInit, OnDestroy {

  @ViewChild('updateTemp') updateTempButton;
  @ViewChild('uploadArticle') uploadArticleButton;
  @ViewChild('classSelect') classSelect: CompleterCmp;
  @ViewChild('froalaEditor') Editor: ElementRef;

  article: Article = {
    dateid: '',
    _id: '',
    article_id: '',
    title: '',
    content: '',
    comment_num: 0,
    like_num: 0,
    classify: '',
    like_status: false,
    article_preview: '',
    theme_img: ''
  }


  articleTemp: Temp = {
    _id: '',
    title: '',
    content: '',
    classify: ''
  };


  temp: Temp = {
    _id: '',
    title: '',
    content: '',
    classify: ''
  };

  private finish: boolean = false;

  clases = [];

  length = 0;

  EditorOption: Object;

  dateid = '';

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

  dataService: CompleterData;

  isOpen: boolean = false;

  constructor(
    private service: ArticleCreateService,
    private articleService: ArticleService,
    private router: Router,
    private completerService: CompleterService
  ) {
    this.dateid = `${Date.now()}`;
  }

  ngOnInit() {
    const that = this;
    this.updateEnable.add(this.updateTempButton.nativeElement);
    this.updateEnable.add(this.uploadArticleButton.nativeElement);
    this.loadImage();
    this.getClassify();
    this.getTemp();
    this.EditorOption = {
      heightMin: 250,
      placeholderText: '在此编辑文章',
      pasteDeniedAttrs: [],
      paragraphStyles: {
        text: 'normal',
        code: 'code',
        para: 'para'
      },
      editorClass: 'text',
      toolbarSticky: false,
      toolbarStickyOffset: 60,
      tabSpaces: 4,
      toolbarButtonsXS: froalaset.toolbarButtonsXS,
      toolbarButtonsMD: froalaset.toolbarButtonsMD,
      toolbarButtonsSM: froalaset.toolbarButtonsSM,
      htmlRemoveTags: [],
      requestHeaders: {
        authorization: localStorage.getItem(execLib.tokenName),
        dateid: that.dateid
      },
      events: {
        'froalaEditor.image.beforePasteUpload': function (e, editor, img) { },
        'froalaEditor.image.beforeUpload': function (e, editor, images) { },
        'froalaEditor.image.uploaded': function (e, editor, response) {
        },
        'froalaEditor.image.inserted': function (e, editor, $img, response) { },
        'froalaEditor.image.loaded': function (e, editor, $img) {
          froalaset.events.imageloaded.apply(that, arguments)
        },
        'froalaEditorimage.beforeRemove': function (e, editor, $img) {
        },
        'froalaEditor.image.removed': function (e, editor, $img) {
          var matchWord = new RegExp(`${execLib.serverPrefix}`, 'gim');
          if (that.finish === false) {
            if ($img.attr('src').match(matchWord)) {
              froalaset.events.imageremoved.deleteImage.call(that, e, editor, $img)
            }
          }
        },
        'froalaEditor.imageManager.beforeDeleteImage': function (e, editor, $img) { },
        'froalaEditor.imageManager.imageDeleted': function (e, editor, data) { },
        'froalaEditor.imageManager.imageLoaded': function (e, editor, $img) { },
        'froalaEditor.imageManager.imagesLoaded': function (e, editor, data) { },
        'froalaEditor.charCounter.exceeded': function (e, editor) { },
        'froalaEditor.charCounter.update': function (e, editor) { },
        'froalaEditor.keyup': function (e, editor, keyupEvent) {
          if (keyupEvent.altKey && keyupEvent.keyCode === 83) {
            that.updateTemp();
          }
        },
        'froalaEditor.keypress': function (e, editor, keypressEvent) {
        },
        'froalaEditor.keydown': function (e, editor, keydownEvent) {
        }
      },
      imageUploadURL: `${execLib.apiName}article/createSaveImage`,
      imageUploadMethod: 'POST',
      imageManagerLoadURL: '',
      imageManagerDeleteURL: '',
      imageManagerDeleteMethod: 'POST',
      imagePaste: true,
      imagePasteProcess: true,
      emoticonsSet: froalaset.emoticonsSet
    };
  }

  ngOnDestroy() {
    this.finish = true;
  }

  @HostListener('window:unload', ['$event'])
  doSomething(event) {

  }

  public gets(event): void {
    var id = event.target.id;
    var parent = event.target.parentElement.id
    switch (true) {
      case id == 'updateTemp' || parent == 'updateTemp':
        this.updateTemp();
        break;
      case id == 'uploadArticle' || parent == 'uploadArticle':
        this.uploadArticle();
        break;
      case id == 'cancleUpload' || parent == 'cancleUpload':
        this.cancleUpload();
        break;
    }
  }

  public loadImage(): void {
    execLib.getexec.call(this,
      this.articleService.createLoadImage({ dateid: this.dateid }),
      null,
      null,
      null
    )
  }


  public getTemp(): void {
    execLib.getexec.call(this,
      this.articleService.getTemp({ dateid: this.dateid }),
      function (res) {
        var resp: Temp = res.data[0];
        const { _id, title, content, classify } = resp;
        Object.assign(this.temp, { _id, title, content, classify });
        Object.assign(this.article, { _id, title, content, classify });
        this.updateEnable.enable()
      },
      null
    )
  }

  public updateTemp(): void {
    let { title, content, classify } = this.article;
    if (classify.length == 0) {
      classify = this.clases[0].classify;
    } else {
      var index = _.findIndex(this.clases, {
        classify: this.article.classify
      });
    }
    if (index < 0) {
      alert('该分类不存在或被删除')
    } else {
      const { _id } = this.temp;
      Object.assign(this.articleTemp, { _id, title, content, classify, dateid: this.dateid });
      this.updateEnable.disable();
      execLib.uploadexec.call(this,
        this.service.updateTemp(this.articleTemp),
        function () {
          this.updateEnable.enable()
        },
        null,
        null
      )
    }
  }

  public uploadArticle(): void {
    if(this.article.content){
      var matchWord = new RegExp(`${execLib.filePrefix}(.*?).(jpg|pdf|JPG)`, 'gim');
      var img = this.article.content.match(matchWord);
      if (img != null) {
        this.article.theme_img = img[0]
      }
    }
    if (this.article.classify.length == 0) {
      this.article.classify = this.clases[0].classify;
    }
    var index = _.findIndex(this.clases, {
      classify: this.article.classify
    });
    if (index < 0) {
      alert('该分类不存在或被删除')
    } else {
      this.article.article_preview = articleCreateLib.previewtext.call(this);
      this.article.dateid = this.dateid;
      this.updateEnable.disable();
      this.finish = true;
      execLib.uploadexec.call(this,
        this.service.uploadArticle(this.article),
        function () {
          this.router.navigate([`/pages/article/articlemanage`]);
        },
        null
      )
    }
  }

  public cancleUpload(): void {
    this.router.navigate([`/pages/article/articlemanage`]);
  }

  public getClassify(): void {
    execLib.getexec.call(this,
      this.articleService.getClassfy(),
      function (res) {
        this.clases = res.data;
        this.dataService = this.completerService.local(this.clases, 'classify', 'classify');
      },
      null
    )
  }

  public onOpened(isOpen: boolean) {
    this.isOpen = isOpen;
  }


  public onQuoteSelected(selected: CompleterItem) {
    if (selected) {
      this.article.classify = selected.title
    }
  }

  public onToggle() {
    if (this.isOpen) {
      this.classSelect.close();
    } else {
      this.classSelect.open();
    }
  }


}

