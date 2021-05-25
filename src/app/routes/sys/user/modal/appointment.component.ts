import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-appointment',
  templateUrl: './appointment.component.html',
})
export class SysUserAppointmentComponent implements OnInit {
  positions!: any[];

  @Input() user: any;

  constructor(private http: _HttpClient, private modal: NzModalRef, private msgSrv: NzMessageService) {}

  ngOnInit(): void {
    this.queryAppointed();
  }

  queryAppointed(): void {
    this.http.get(`/api/position/appointed/${this.user.username}`).subscribe((value) => {
      const appointed: string[] = value.two.map((v: any) => v.positionCode);

      this.positions = value.one.map((v: any) => {
        v.checked = appointed.indexOf(v.positionCode) !== -1;
        return v;
      });
    });
  }

  submit() {
    const positionCode = this.positions.filter((value) => value.checked).map((value) => value.positionCode);
    this.http.post(`/api/user/appointment/reset`, { username: this.user.username, positionCodes: positionCode }).subscribe((value) => {
      this.msgSrv.success('设置成功');
      this.modal.close();
    });
  }
}
