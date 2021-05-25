import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-view-position',
  templateUrl: './view.component.html',
})
export class SysPositionViewComponent implements OnInit {
  @Input()
  record: any;

  schema: SFSchema = {
    properties: {
      positionCode: {
        type: 'string',
        title: '职位编号',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      name: {
        type: 'string',
        title: '名称',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      description: {
        type: 'string',
        title: '简介',
        pattern: '^\\w+$',
        readOnly: true,
        ui: {
          widget: 'string',
        },
      },
      organizationCode: {
        type: 'string',
        title: '组织编号',
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
      roleCode: {
        type: 'string',
        title: '自带角色',
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
