import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { execLib } from 'execlib';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [LoginService]
})
export class Login {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  constructor(
    fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private service: LoginService,
  ) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.service.login(values).subscribe(
        res => {
          if (res.code == 200) {
            localStorage.setItem(execLib.tokenName, res.token);
            this.authService.isLogin();
            if (this.authService.loggedIn) {
              this.router.navigate([`/pages/article/articlemanage`]);
            }
          }
        },
        err => {
          alert('后台错误');
        });
    }
  }
}
