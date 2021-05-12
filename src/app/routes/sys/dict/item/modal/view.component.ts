import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-view-dict-item',
  templateUrl: './view.component.html',
})
export class SysDictItemViewComponent implements OnInit {
  @Input()
  record: any;

  schema: SFSchema = {
    properties: {
      label: {
        type: 'string',
        title: '键',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      val: {
        type: 'integer',
        title: '值',
        readOnly: true,
      },
      sortRank: { type: 'number', title: '排序', readOnly: true },
      dictTypeCode: { type: 'number', title: '类型编码', readOnly: true },
      parentId: { type: 'number', title: '父id', readOnly: true },
      parents: {
        type: 'string',
        title: '路径',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      description: {
        type: 'string',
        title: '备注',
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
