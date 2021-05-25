import { Component, Input, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-change-pwd',
  templateUrl: './change-pwd.component.html',
})
export class SysUserChangePwdComponent implements OnInit {
  @Input() user: any;
  @Input() force = false;

  _schema: SFSchema = {
    properties: {
      username: {
        type: 'string',
        title: '账号',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      newPassword: {
        type: 'string',
        title: '新密码',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
    },
    required: ['username', 'newPassword'],
    ui: {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  schema!: SFSchema;

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (!this.force) {
      // @ts-ignore
      this._schema.properties.oldPassword = {
        type: 'string',
        title: '旧密码',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      };
      this._schema.required!.push('oldPassword');
    }

    this.schema = this._schema;
  }

  close() {
    this.modal.destroy();
  }

  save(value: any) {
    if (this.force) {
      this.http.post(`/api/user/change-pwd/force/${value.username}/${value.newPassword}`).subscribe((res) => {
        this.msgSrv.success('修改成功');
        this.modal.close(res);
      });
    } else {
      this.http.post(`/api/user/change-pwd/${value.username}/${value.oldPassword}/${value.newPassword}`, value).subscribe((res) => {
        this.msgSrv.success('修改成功');
        this.modal.close(res);
      });
    }
  }
}
