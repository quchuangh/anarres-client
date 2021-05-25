import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-create-position',
  templateUrl: './create.component.html',
})
export class SysPositionCreateComponent implements OnInit {
  rolePrefix = 'position:';

  schema: SFSchema = {
    properties: {
      positionCode: {
        type: 'string',
        title: '职位编号',
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
      organizationCode: {
        type: 'string',
        title: '组织编号',
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
      roleCode: {
        type: 'string',
        title: '自带角色',
      },
    },
    required: ['position_code', 'name', 'description', 'organization_code', 'enabled', 'role_code'],
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
    this.http.post(`/api/position/create`, value).subscribe((res) => {
      this.msgSrv.success('添加成功');
      this.modal.close(res);
    });
  }

  close() {
    this.modal.destroy();
  }
}
