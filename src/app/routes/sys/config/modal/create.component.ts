import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFSchemaEnum, SFSelectWidgetSchema } from '@delon/form';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-config',
  templateUrl: './create.component.html',
})
export class SysConfigCreateComponent implements OnInit {
  rolePrefix = 'config:';

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
      value: {
        type: 'string',
        title: '值',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '角色唯一标识,不可重复,由字母,下划线,数字组合',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      valueRegex: {
        type: 'string',
        title: '值校验',
        default: '.*',
        ui: {
          placeholder: '值校验',
          widget: 'select',
          serverSearch: true,
          onSearch: this.valueRegexSearcher,
        } as SFSelectWidgetSchema,
      },
    },
    required: ['code', 'value', 'dict_type'],
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
    this.http.post(`/api/config/create`, value).subscribe((res) => {
      this.msgSrv.success('添加成功');
      this.modal.close(res);
    });
  }

  close() {
    this.modal.destroy();
  }
}
