import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.less'],
  host: {
    '[class.ant-row]': 'true',
    '[class.pro-passport]': 'true',
  },
})
export class UserLogin2Component implements OnDestroy {
  form: FormGroup;
  error = '';

  constructor(fb: FormBuilder, private router: Router, private msg: NzMessageService, public http: _HttpClient) {
    this.form = fb.group({
      mobilePrefix: ['+86'],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  // #region fields

  get password(): AbstractControl {
    return this.form.controls.password;
  }
  get mobile(): AbstractControl {
    return this.form.controls.mobile;
  }
  get captcha(): AbstractControl {
    return this.form.controls.captcha;
  }

  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  submit(): void {
    this.error = '';
    const data = this.form.value;
    this.http.post('/register', data).subscribe(() => {
      this.router.navigate(['passport', 'register-result'], { queryParams: { email: data.mail } });
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
