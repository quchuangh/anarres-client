import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RoleVO } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
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

  constructor(public http: _HttpClient) {}

  ngOnInit(): void {}

  save(): void {
    let data;
    if (this.model === 'table') {
      data = this.table.getNewData();
    } else {
      data = this.tree.getNewData();
    }
    console.log(data);
  }

  close(): void {
    this.onClose.emit(false);
  }
}
