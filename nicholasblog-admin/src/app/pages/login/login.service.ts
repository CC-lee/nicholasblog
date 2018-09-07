import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {
  constructor(private http: Http) { }

  login(values): Observable<any> {
    const { email, password } = values;
    const admin = {
      email: email,
      password: password
    };
    return this.http.post(`${execLib.apiName}admin/login`, admin).map(res => res.json());
  }

}