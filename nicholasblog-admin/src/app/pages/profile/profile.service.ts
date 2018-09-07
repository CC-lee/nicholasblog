import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from '../auth.service';
import { execLib } from 'execlib';

@Injectable()
export class ProfileService {

  jwtHelper: JwtHelper = new JwtHelper();

  ajaxfunc = execLib.ajaxexec('admin')
  constructor(
    private http: Http,
    public auth: AuthService
  ) { }

  adminProfile(): Observable<any> {
    const token = localStorage.getItem(execLib.tokenName);
    const { email, name } = this.jwtHelper.decodeToken(token);
    return this.ajaxfunc('profile', { email, admin_name: name });
  }

  modifyProfile(profile): Observable<any> {
    return this.ajaxfunc('modifyProfile', profile);
  }

  deleteImage(image): Observable<any> {
    return this.ajaxfunc('deleteImage', image);
  }

  eidtLoadImage(): Observable<any> {
    return this.ajaxfunc('editLoadImage', null);
  }

}
