import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-create-user',
  templateUrl: './create.component.html',
})
export class SysUserCreateComponent implements OnInit {
  rolePrefix = 'user:';

  schema: SFSchema = {
    properties: {
      username: {
        type: 'string',
        title: '账号',
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
        title: '昵称',
        ui: {
          widget: 'string',
          placeholder: '输入昵称',
        },
      },

      ipBound: {
        type: 'string',
        title: '绑定IP',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
      macBound: {
        type: 'string',
        title: '绑定MAC',
        pattern: '^\\w+$',
        ui: {
          widget: 'string',
          placeholder: '',
          errors: {
            pattern: '仅支持输入字母、下划线、数字',
          },
        },
      },
    },
    required: ['username', 'name'],
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
    this.http.post(`/api/user/create`, value).subscribe((res) => {
      this.msgSrv.success('添加成功, 密码: ' + res);
      this.modal.close(res);
    });
  }

  close() {
    this.modal.destroy();
  }
}
