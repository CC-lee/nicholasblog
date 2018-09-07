import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderlistEditService } from './orderlist-edit.service';
import { UserService } from '../user.service';
import { execLib } from 'execlib';

interface Order {
  code: number;
  data: {
    _id: string;
    item_list: [object];
    total_price: number;
  }
}

@Component({
  selector: 'app-orderlist-edit',
  templateUrl: './orderlist-edit.component.html',
  styleUrls: ['./orderlist-edit.component.scss'],
  providers: [OrderlistEditService]
})


export class OrderlistEditComponent implements OnInit {

  _id = '';
  lists = [];
  total = 0;

  constructor(
    private _state: GlobalState,
    private router: Router,
    private service: OrderlistEditService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {

  }

  ngOnInit() {
    this.selectAndNotify();
    this.activatedRoute.params.subscribe(res => {
      this.getOneOrder(res.id);
    });
  }
  /**
   * @returns void
   */
  selectAndNotify(): void {
    this._state.notifyDataChanged('menu.activeLink', { title: '订单编辑' });
  }
  /**
   * @param  {string} id 订单id号
   * @returns void
   */
  getOneOrder(id: string): void {
    execLib.getexec.call(this,
      this.userService.getOrder(id),
      function(res){
        var resp: Order = res;
        if (resp.code == 200) {
          this._id = resp.data._id;
          this.lists = resp.data.item_list;
          this.total = resp.data.total_price;
        }
      },
      null
    )
  }
  /**
   * @returns void
   */
  updateOrder(): void {
    var order = {
      _id: this._id,
      total_price: this.total
    }
    execLib.uploadexec.call(this,
      this.service.updateOrder(order),
      function () {
        this.router.navigate([`/pages/user/orderlistmanage`]);
      },
      null
    )
  }

  cancleUpdate(): void {
    this.router.navigate([`/pages/user/orderlistmanage`]);
  }
}
