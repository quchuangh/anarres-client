import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit.component.html',
})
export class SysUserEditComponent implements OnInit {
  rolePrefix = 'user:';

  @Input()
  record: any;

  schema: SFSchema = {
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
      password: {
        type: 'string',
        title: '密码',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      salt: {
        type: 'string',
        title: '盐',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      // 所有未知的复杂类型都当作枚举处理
      state: {
        type: 'array',
        title: '状态',
        enum: [
          { label: 'v0', value: 0 },
          { label: 'v1', value: 1 },
        ],
        default: 0,
        ui: { placeholder: '状态', widget: 'select' },
      },
      loginTimes: { type: 'number', title: '登录次数' },
      lastLoginTime: {
        type: 'string',
        title: '最后登录时间',
        format: 'date-time',
      },
      lastLoginIp: {
        type: 'string',
        title: '最后登录IP',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      loginSuccessTimes: { type: 'number', title: '登录成功次数' },
      ipBound: {
        type: 'string',
        title: '绑定IP',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      macBound: {
        type: 'string',
        title: '绑定MAC',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      deleted: {
        type: 'boolean',
        title: '是否删除',
        enum: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        default: true,
        ui: { placeholder: '是否启用', widget: 'select' },
      },
    },
    required: [
      'username',
      'password',
      'salt',
      'state',
      'login_times',
      'last_login_time',
      'last_login_ip',
      'login_success_times',
      'ip_bound',
      'mac_bound',
      'deleted',
    ],
    ui: {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,

    public http: _HttpClient,
  ) {}

  ngOnInit(): void {}

  save(value: any) {
    this.http.post(`/api/user/edit`, value).subscribe((res) => {
      this.msgSrv.success('修改成功');
      this.modal.close(res);
    });
  }

  close() {
    this.modal.destroy();
  }
}
