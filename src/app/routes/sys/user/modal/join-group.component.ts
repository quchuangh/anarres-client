import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { NzTreeNode } from 'ng-zorro-antd/core/tree';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, zip } from 'rxjs';

@Component({
  selector: 'app-user-join-group',
  templateUrl: './join-group.component.html',
})
export class SysUserJoinGroupComponent implements OnInit {
  data!: any[];
  node!: NzTreeNode[];

  @Input() user: any;

  constructor(private http: _HttpClient, private modal: NzModalRef, private arrSrv: ArrayService, private msgSrv: NzMessageService) {}

  ngOnInit(): void {
    this.queryOrg();
  }

  queryOrg(): void {
    const all$: Observable<any[]> = this.http.get('/api/sys/organization/all');
    const joined$: Observable<any[]> = this.http.get(`/api/sys/organization/joined/${this.user.username}`);

    zip(all$, joined$).subscribe(([all, joined]) => {
      const joinedCodes: string[] = joined.map((value) => value.code);

      this.data = all;
      all.forEach((value) => (value.joined = joinedCodes.indexOf(value.code) !== -1));

      this.node = this.arrSrv.arrToTreeNode(all, {
        titleMapName: 'name',
        parentIdMapName: 'parentId',
        cb: (item, _parent, deep) => {
          item.expanded = deep <= 1;
        },
      });
    });
  }

  submit() {
    const codes = this.data.filter((value) => value.joined).map((value) => value.code);
    this.http.post(`/api/user/join-group/reset`, { username: this.user.username, organizationCodes: codes }).subscribe((value) => {
      this.msgSrv.success('设置成功');
      this.modal.close();
    });
  }
}
