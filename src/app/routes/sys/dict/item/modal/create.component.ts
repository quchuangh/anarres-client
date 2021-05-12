import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-create-dict-item',
  templateUrl: './create.component.html',
})
export class SysDictItemCreateComponent implements OnInit {
  rolePrefix = 'dict:';
  @Input() dict!: any;
  @Input() parentItem!: any;

  initData = {} as any;

  schema: SFSchema = {
    properties: {
      label: {
        type: 'string',
        title: '名称',
        ui: {
          widget: 'string',
        },
      },
      val: {
        type: 'integer',
        title: '值',
        ui: {
          max: 125,
        },
      },
      sortRank: { type: 'number', title: '排序' },
      dictTypeCode: { type: 'string', title: '类型编码', readOnly: true },
      parentId: { type: 'number', title: '父id', readOnly: true },
      description: {
        type: 'string',
        title: '备注',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 10 },
          placeholder: '添加描述',
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
        ui: { placeholder: '是否启用', widget: 'select' },
      },
    },
    required: ['label', 'val', 'sort_rank', 'dict_type_code', 'parent_id', 'description', 'enabled'],
    ui: {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.dict) {
      this.initData.dictTypeCode = this.dict.code;
    }
    if (this.parentItem) {
      this.initData.parentId = this.parentItem.id;
    } else {
      this.initData.parentId = 0;
    }
  }

  save(value: any) {
    this.http.post(`/api/dict/item/create`, value).subscribe((res) => {
      this.msgSrv.success('添加成功');
      this.modal.close(res);
    });
  }

  close() {
    this.modal.destroy();
  }
}
