import { Component, OnInit, OnDestroy, ViewChild, DoCheck } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { ArticleService } from '../service/article.service';
import { ArticleEditService } from './article-edit.service';
import { Article } from './article-editlib';
import { articleEditLib } from './article-editlib';
import { execLib } from 'execlib';
import froalaset from './froalaset';
import { CompleterCmp, CompleterService, CompleterData, CompleterItem, RemoteData } from 'ng2-completer';
import * as _ from 'lodash';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss'],
  providers: [ArticleEditService]
})
export class ArticleEditComponent implements OnInit, OnDestroy {

  @ViewChild('updateArticle') updateArticleButton;
  @ViewChild('classSelect') classSelect: CompleterCmp;

  article: Article = {
    objectId: '',
    dateid: '',
    _id: '',
    title: '',
    content: '',
    classify: '',
    article_preview: '',
    theme_img: ''
  }

  clases = [];

  id = '';

  EditorOption: Object;

  finish: boolean = false;


  subscription = this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.finish = true;
      }
    });

  dateid = '';

  dataService: CompleterData;
  
  isOpen: boolean = false;

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


  constructor(
    private _state: GlobalState,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: ArticleEditService,
    private articleService: ArticleService,
    private completerService: CompleterService
  ) {
    this.dateid = `${Date.now()}`;

  }

  ngOnInit() {
    this.selectAndNotify();
    this.updateEnable.add(this.updateArticleButton.nativeElement);
    this.getClassify();
    this.activatedRoute.params.subscribe(res => {
      this.id = res.id;
    });
    this.loadImage(this.id);
    this.getOneArticle(this.id);
    const that = this;
    this.EditorOption = {
      heightMin: 250,
      placeholderText: '在此编辑文章',
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
        objectId: that.id,
        dateid: that.dateid
      },
      events: {
        'froalaEditor.image.beforePasteUpload': function (e, editor, img) { },
        'froalaEditor.image.beforeUpload': function (e, editor, images) { },
        'froalaEditor.image.uploaded': function (e, editor, response) { },
        'froalaEditor.image.inserted': function (e, editor, $img, response) { },
        'froalaEditor.image.loaded': function (e, editor, $img) { },
        'froalaEditorimage.beforeRemove': function (e, editor, $img) { },
        'froalaEditor.image.removed': function (e, editor, $img) {
          var matchWord = new RegExp(`${execLib.host}`, 'gim');
          if (that.finish == false) {
            if ($img.attr('src').match(matchWord)) {
              froalaset.events.imageremoved.deleteImage.call(that, e, editor, $img)
            }
          }
        },
        'froalaEditor.imageManager.beforeDeleteImage': function (e, editor, $img) { },
        'froalaEditor.imageManager.imageDeleted': function (e, editor, data) { },
        'froalaEditor.imageManager.imageLoaded': function (e, editor, $img) { },
        'froalaEditor.imageManager.imagesLoaded': function (e, editor, data) { },
        'froalaEditor.keyup': function (e, editor, keyupEvent) {
          if (keyupEvent.altKey && keyupEvent.keyCode === 83) {
            that.updateArticle();
          }
        }
      },
      imageUploadURL: `${execLib.apiName}article/editSaveImage`,
      imageUploadMethod: 'POST',
      imageManagerLoadURL: '',
      imageManagerDeleteURL: '',
      imageManagerDeleteMethod: 'POST',
      imagePaste: true,
      imagePasteProcess: true,
      emoticonsSet: froalaset.emoticonsSet
    };
  }

  public gets(event): void {
    var id = event.target.id;
    switch (id) {
      case 'updateArticle':
        this.updateArticle();
        break;
      case 'cancleUpdate':
        this.cancleUpdate();
        break;
    }
  }

  public loadImage(id): void {
    execLib.getexec.call(this,
      this.articleService.eidtLoadImage({
        objectId: id,
        dateid: this.dateid
      }),
      null,
      null,
      null
    )
  }

  public getOneArticle(id): void {
    execLib.getexec.call(this,
      this.articleService.getOneArticle({
        _id: id,
        dateid: this.dateid
      }),
      function (res) {
        var resp: Article = res.data;
        let { _id, title, content, classify } = resp;
        Object.assign(this.article, { _id, title, content, classify });
        this.updateEnable.enable();
      },
      null
    );
  }


  public updateArticle(): void {
    const matchWord = new RegExp(`${execLib.filePrefix}(.*?).(jpg|pdf|JPG)`, 'gim');
    const img = this.article.content.match(matchWord);
    if (img != null) {
      this.article.theme_img = img[0];
    }
    var index = _.findIndex(this.clases, {
      classify: this.article.classify
    });
    if (index < 0) {
      alert('该分类不存在或被删除')
    } else {
      this.updateEnable.disable();
      this.article.article_preview = articleEditLib.previewtext.call(this)
      this.finish = true;
      this.article.dateid = this.dateid;
      this.article.objectId = this.article._id;
      execLib.uploadexec.call(this,
        this.service.updateArticle(this.article),
        function () {
          //this.router.navigate([`/pages/article/articlemanage`]);
          this.updateEnable.enable();
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

  public cancleUpdate(): void {
    this.router.navigate([`/pages/article/articlemanage`]);
  }

  public getClassify(): void {
    execLib.getexec.call(this,
      this.articleService.getClassfy(),
      function (res) {
        this.clases = res.data;
        this.dataService = this.completerService.local(this.clases, 'classify', 'classify');
      },
      null,
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


  public selectAndNotify(): void {
    this._state.notifyDataChanged('menu.activeLink', { title: '文章编辑' });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
