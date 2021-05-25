import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-assign',
  templateUrl: './assign.component.html',
})
export class SysUserAssignComponent implements OnInit {
  roles!: any[];

  @Input() user: any;

  constructor(private http: _HttpClient, private modal: NzModalRef, private msgSrv: NzMessageService) {}

  ngOnInit(): void {
    this.queryRoles();
  }

  queryRoles(): void {
    this.http.get(`/api/user/roles-info?username=${this.user.username}`).subscribe((value) => {
      const userRoles: string[] = value.two.map((v: any) => v.role);
      this.roles = value.one.map((v: any) => {
        v.checked = userRoles.indexOf(v.role) !== -1;
        return v;
      });
    });
  }

  submit() {
    const roles = this.roles.filter((value) => value.checked).map((value) => value.role);
    this.http.post(`/api/user/assign/role`, { username: this.user.username, roles: roles }).subscribe((value) => {
      this.msgSrv.success('设置成功');
      this.modal.close();
    });
  }
}
