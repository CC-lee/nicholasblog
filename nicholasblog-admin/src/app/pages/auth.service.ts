import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { execLib } from 'execlib';

@Injectable()
export class AuthService {

  profile = {
    _id: '',
    admin_name: '',
    gender: '',
    email: '',
    avatar: '',
  };

  avatarChange = false;

  loggedIn = false;

  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    private router: Router,
    private http: Http
  ) { }

  isLogin() {
    const token = localStorage.getItem(execLib.tokenName);
    if (token) {
      const { email, name } = this.jwtHelper.decodeToken(token);
      if (email && name) {
        this.loggedIn = true;
      }
    }
  }

  getProfile() {
    const token = localStorage.getItem(execLib.tokenName);
    const { email, name } = this.jwtHelper.decodeToken(token);
    this.http.post(`${execLib.apiName}admin/profile`, { email, admin_name: name }, this.headerSet()).subscribe(
      res => {
        const profile = res.json();
        Object.assign(this.profile, profile.profile);
      }
    );
  }

  headerSet() {
    const header = new Headers({
      'Content-Type': 'application/json',
      'charset': 'UTF-8',
      'Authorization': localStorage.getItem(execLib.tokenName)
    });
    const options = new RequestOptions({ headers: header });
    return options;
  }

  logout() {
    localStorage.removeItem(execLib.tokenName);
    this.loggedIn = false;
    location.replace(`${execLib.hostBackMainPath}`);
  }


}
