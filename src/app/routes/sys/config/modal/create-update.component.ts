import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { distinctUntilChanged, filter, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-create-config',
  templateUrl: './create-update.component.html',
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        margin: 0 5px;
      }
    `,
  ],
})
export class SysConfigCreateAndUpdateComponent implements OnInit {
  rolePrefix = 'config:';
  form!: FormGroup;

  actionType: 'create' | 'update' = 'create';

  @Input()
  data: { id?: string; code?: string; value?: string; valueRegex?: string } = {};

  @Input()
  valueRegexList: Array<{ label: string; value: string }> = [];

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private fb: FormBuilder, public http: _HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [this.data.code, [Validators.required.bind(this), Validators.pattern('^\\w+$')]],
      value: [this.data.value, [Validators.required.bind(this), Validators.pattern('^\\w+$'), this.valueRegexValidator.bind(this)]],
      valueRegex: [this.data.valueRegex, [Validators.required.bind(this), this.regexValidator.bind(this)]],
    });

    this.form.valueChanges
      .pipe(
        pluck('valueRegex'),
        distinctUntilChanged(),
        filter((v) => !!v),
      )
      .subscribe(() => {
        this.form.controls.value.updateValueAndValidity();
      });
  }

  valueRegexValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.form) {
      return null;
    }
    const { valueRegex } = this.form.value;
    if (!control.value || !valueRegex) {
      return null;
    }
    try {
      if (new RegExp(valueRegex).test(control.value)) {
        return null;
      }
    } catch (e) {
      console.warn(e);
      return { valueRegex: true };
    }
    return { valueRegex: true };
  }

  regexValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    try {
      const regx = new RegExp(control.value);
    } catch (e) {
      // 错误的正则表达式
      return { regexp: true };
    }
    return null;
  }

  save(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (!this.form.valid) {
      return;
    }
    const value = this.form.value;
    if (this.actionType === 'create') {
      this.http.post(`/api/config/create`, value).subscribe((res) => {
        this.modal.close(true);
      });
    } else {
      const data = Object.assign({ id: this.data.id }, value);

      this.http.post(`/api/config/update`, data).subscribe((res) => {
        this.modal.close(true);
      });
    }
  }

  close(): void {
    this.modal.destroy();
  }

  addItem(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value && this.valueRegexList.every((item) => item.value !== value)) {
      this.valueRegexList = [...this.valueRegexList, { label: value, value }];
      this.form.patchValue({ valueRegex: value });
    }
  }
}
