import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-view-user',
  templateUrl: './view.component.html',
})
export class SysUserViewComponent implements OnInit {
  @Input()
  record: any;

  schema: SFSchema = {
    properties: {
      username: {
        type: 'string',
        title: '账号',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      password: {
        type: 'string',
        title: '密码',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      salt: {
        type: 'string',
        title: '盐',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      // 所有未知的复杂类型都当作枚举处理
      state: {
        type: 'array',
        title: '状态',
        enum: [
          { label: '正常', value: 'NORMAL' },
          { label: '禁用', value: 'LOCKED' },
        ],
        default: 0,
        readOnly: true,
        ui: { placeholder: '状态', widget: 'select' },
      },
      loginTimes: { type: 'number', title: '登录次数', readOnly: true },
      lastLoginTime: {
        type: 'string',
        title: '最后登录时间',
        format: 'date-time',
        readOnly: true,
      },
      lastLoginIp: {
        type: 'string',
        title: '最后登录IP',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      loginSuccessTimes: { type: 'number', title: '登录成功次数', readOnly: true },
      ipBound: {
        type: 'string',
        title: '绑定IP',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      macBound: {
        type: 'string',
        title: '绑定MAC',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
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
        readOnly: true,
        ui: { placeholder: '是否启用', widget: 'select' },
      },
    },
    ui: {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modal.destroy();
  }
}
