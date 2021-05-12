import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-edit-dict-item',
  templateUrl: './edit.component.html',
})
export class SysDictItemEditComponent implements OnInit {
  rolePrefix = 'dictItem:';

  @Input()
  record: any;

  schema: SFSchema = {
    properties: {
      label: {
        type: 'string',
        title: '键',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
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
      dictTypeCode: { type: 'number', title: '类型编码' },
      parentId: { type: 'number', title: '父id' },
      parents: {
        type: 'string',
        title: '路径',
        pattern: '^\\w+$',
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
    required: ['label', 'val', 'sort_rank', 'dict_type_code', 'parent_id', 'parents', 'description', 'enabled'],
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
    this.http.post(`/api/dict/item/edit`, value).subscribe((res) => {
      this.msgSrv.success('修改成功');
      this.modal.close(res);
    });
  }

  close() {
    this.modal.destroy();
  }
}
