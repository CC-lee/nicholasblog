import * as _ from 'lodash';
export class SelectItem {
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