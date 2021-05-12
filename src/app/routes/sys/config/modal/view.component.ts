import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-view-config',
  templateUrl: './view.component.html',
})
export class SysConfigViewComponent implements OnInit {
  @Input()
  record: any;

  schema: SFSchema = {
    properties: {
      code: {
        type: 'string',
        title: '编码',
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
      value: {
        type: 'string',
        title: '值',
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
      dictType: {
        type: 'string',
        title: '字典类型编号',
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
