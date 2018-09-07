import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, private router: Router) { }

  canActivate() {
    if (this.auth.loggedIn) {
      return true;
    } else {

    }
  }

  canActivateChild() {
    this.auth.isLogin();
    this.auth.getProfile();
    if (this.auth.loggedIn) {
      return true;
    } else {
      this.router.navigate([`/login`]);
    }
  }

}
