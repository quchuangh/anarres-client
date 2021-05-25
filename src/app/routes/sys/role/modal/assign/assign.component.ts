import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RoleVO } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SysRoleAssignAbilityTableComponent } from './table/assign-ability-table.component';
import { SysRoleAssignAbilityTreeComponent } from './tree/assign-ability-tree.component';

@Component({
  selector: 'app-assign-role',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.less'],
})
export class SysRoleAssignComponent implements OnInit {
  @Input()
  role!: RoleVO;

  model: 'tree' | 'table' = 'tree';

  @ViewChild('table', { static: false }) table!: SysRoleAssignAbilityTableComponent;
  @ViewChild('tree', { static: false }) tree!: SysRoleAssignAbilityTreeComponent;

  @Output()
  onClose = new EventEmitter<boolean>();

  constructor(public http: _HttpClient, private notification: NzNotificationService) {}

  ngOnInit(): void {}

  save(): void {
    let data;
    if (this.model === 'table') {
      data = this.table.getNewData();
    } else {
      data = this.tree.getNewData();
    }
    console.log(data);
    this.http.post('/api/role/assign', data).subscribe((value) => {
      if (value) {
        if (this.model === 'table') {
          data = this.table.refresh();
        } else {
          data = this.tree.refresh();
        }
        this.notification.success('success', '权限修改成功');
      } else {
        this.notification.error('fail', '权限修改失败');
      }
    });
  }

  close(): void {
    this.onClose.emit(false);
  }
}
