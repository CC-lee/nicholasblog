import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { execLib } from 'execlib';
import 'rxjs/add/operator/map';

@Injectable()
export class RegisterService {
  constructor(private http: Http) {

  }

  register(values): Observable<any> {
    const { email, name, passwords } = values;
    const admin = {
      admin_name: name,
      gender: '',
      email: email,
      avatar: '',
      password: passwords.password
    };
    return this.http.post(`${execLib.apiName}admin/register`, admin).map(res => res.json());
  }
}
