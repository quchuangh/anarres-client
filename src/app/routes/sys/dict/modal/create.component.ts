import { Component, Input, OnInit } from '@angular/core';
import { SFSchema, SFSchemaEnum, SFSelectWidgetSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-dict',
  templateUrl: './create.component.html',
})
export class SysDictCreateComponent implements OnInit {
  rolePrefix = 'dictType:';

  @Input()
  valueRegexSearcher!: (q: string) => Promise<Array<SFSchemaEnum>>;

  schema: SFSchema = {
    properties: {
      code: {
        type: 'string',
        title: '编码',
        pattern: '^\\w+$',
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
        ui: { placeholder: '是否启用', widget: 'select' },
      },
      // valueRegex : {
      //   type: 'string',
      //   title: '值校验',
      //   default: '.*',
      //   ui: {
      //     placeholder: '值校验', widget: 'select',
      //     serverSearch: true,
      //     onSearch: this.valueRegexSearcher
      //   } as SFSelectWidgetSchema
      // },
      name: {
        type: 'string',
        title: '昵称',
        ui: {
          widget: 'string',
          placeholder: '昵称',
        },
      },
      description: {
        type: 'string',
        title: '说明',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 10 },
          placeholder: '添加描述',
        },
      },
    },
    required: ['code', 'enabled', 'value_type', 'name', 'description'],
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
    this.http.post(`/api/dict/type/create`, value).subscribe((res) => {
      this.msgSrv.success('添加成功');
      this.modal.close(res);
    });
  }

  close() {
    this.modal.destroy();
  }
}
