import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-view-role',
  templateUrl: './view.component.html',
})
export class SysRoleViewComponent implements OnInit {
  @Input()
  record: any;

  schema: SFSchema = {
    properties: {
      role: {
        type: 'string',
        title: '角色标识',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      name: {
        type: 'string',
        title: '名称',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      description: {
        type: 'string',
        title: '简介',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      enabled: {
        type: 'boolean',
        title: '是否启用',
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
