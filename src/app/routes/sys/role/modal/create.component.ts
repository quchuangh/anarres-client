import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-create-role',
  templateUrl: './create.component.html',
})
export class SysRoleCreateComponent implements OnInit {
  rolePrefix = 'role:';

  schema: SFSchema = {
    properties: {
      role: {
        type: 'string',
        title: '角色标识',
        pattern: '^\\w+$',
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
        ui: {
          widget: 'string',
          placeholder: '填入角色名字（可以用中文）',
        },
      },
      description: {
        type: 'string',
        title: '简介',
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
    required: ['role', 'name', 'description', 'enabled'],
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

  save(value: any, assign: boolean) {
    this.http.post(`/api/role/create`, value).subscribe((res) => {
      this.msgSrv.success('添加成功');
      this.modal.close({ result: res, assign });
    });
  }

  close() {
    this.modal.destroy();
  }
}
