import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, private router: Router) { }

  canActivate() {
    this.auth.isLogin();
    if (this.auth.loggedIn) {
      return true;
    } else {
      this.router.navigate([`/login`]);
    }
  }

}
