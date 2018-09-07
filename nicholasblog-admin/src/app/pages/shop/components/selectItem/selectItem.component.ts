import { Component, Input, Output, EventEmitter, OnInit, DoCheck } from '@angular/core';
import { execLib } from 'execlib';
@Component({
  selector: 'app-selectItem',
  templateUrl: './selectItem.component.html',
  styleUrls: ['./selectItem.component.scss']
})
export class SelectItemComponent implements OnInit, DoCheck {
  @Input() selectItems: Array<any> = [];
  @Input() selectShow: boolean = false
  @Input() selects: number = 0


  colorArr = ['pink', 'blue', 'red', 'orange', 'yellow', 'green', 'purple', 'cyan', 'brown', 'white'];

  constructor() {
    execLib.proxyListen(this, 'selectShow').subscribe(x => {
      if (x.newValue === true) {
        for (var i = 0; i < this.selectItems.length; i++) {
          this.showCheck(this.selectItems[i]);
        }
        for (var i = 0; i < this.selectItems.length; i++) {
          execLib.proxyListen(this.selectItems[i], 'selectKind/choice').subscribe(x => {
            for (var i = 0; i < this.selectItems.length; i++) {
              this.showCheck(this.selectItems[i]);
            }
          })
        }
      }
    })
  }

  ngOnInit() {

  }

  showCheck(selectItem) {
    if (selectItem.selectKind.choice === '自定义种类') {
      selectItem.selectKind.category = true;
      selectItem.selectKind.color = false;
      selectItem.item_option.select = '自定义种类';
    } else {
      selectItem.selectKind.color = true;
      selectItem.selectKind.category = false;
      selectItem.item_option.select = '颜色';
    }
  }

  ngDoCheck() {
    //console.log(this.selectItems);
    /** 
    if (this.selectShow === true) {
      for (var i = 0; i < this.selectItems.length; i++) {
        this.showCheck(this.selectItems[i]);
      }
    }*/
  }

}
