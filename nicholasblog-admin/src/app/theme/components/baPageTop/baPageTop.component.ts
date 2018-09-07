import { Component, DoCheck } from '@angular/core';

import { GlobalState } from '../../../global.state';
import { Router } from '@angular/router';
import { AuthService } from '../../../pages/auth.service';
import { BaPageTopService } from './baPageTop.service';
import { execLib } from 'execlib';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
  providers: [BaPageTopService]
})
export class BaPageTop implements DoCheck {

  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;

  link = `${execLib.filePrefix}admin/default/Kostya.jpg`;

  constructor(
    private _state: GlobalState,
    private router: Router,
    public auth: AuthService,
    private service: BaPageTopService,
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this.loadAvatar();
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  loadAvatar() {
    this.service.loadAvatar().subscribe(
      res => {
        if (res.data && res.data.length > 0) {
          this.link = res.data[0].url;
        } else {
          this.link = `${execLib.filePrefix}admin/default/Kostya.jpg`;
          if (res.message === '授权已经过期，请重新登陆') {
            this.signout()
          }
        }
      },
      err => {
        console.log('后台错误');
      }
    );
  }

  profile() {
    this.router.navigate([`/pages/profile`]);
  }

  signout() {
    this.auth.logout();
  }

  ngDoCheck() {
    if (this.auth.avatarChange == true) {
      this.loadAvatar();
      this.auth.avatarChange = false;
    }
  }

}
