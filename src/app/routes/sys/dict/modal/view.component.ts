import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-view-dict',
  templateUrl: './view.component.html',
})
export class SysDictViewComponent implements OnInit {
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
      name: {
        type: 'string',
        title: '昵称',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      description: {
        type: 'string',
        title: '说明',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
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
