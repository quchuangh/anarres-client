import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from '@ag-grid-community/core';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'app-sys-role-ability-cell-renderer',
  styleUrls: ['./ability-cell-renderer.component.less'],
  templateUrl: './ability-cell-renderer.component.html',
})
export class SysRolesAbilityCellRendererComponent implements OnInit, ICellRendererAngularComp {
  abilities: Array<any> = [];

  canAssignAbility = false;
  canAbility = false;

  params!: ICellRendererParams;

  checkedField = [];

  constructor(public msgSrv: NzMessageService, public http: _HttpClient, private aclService: ACLService) {}

  ngOnInit(): void {
    this.canAssignAbility = this.aclService.canAbility('roles:assign');
    this.canAbility = this.aclService.canAbility('role:ability');
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: ICellRendererParams): void {
    this.initData(params);
  }

  initData(params: ICellRendererParams) {
    this.params = params;
    this.abilities = (params.data.abilities || [])
      .map((item: any) => {
        let field = item.fieldCohesiveList && item.fieldCohesiveList.length;
        return Object.assign({}, item, { label: item.name, value: item.id, field });
      })
      .sort((a: any, b: any) => {
        return (a.sort ? a.sort : 0) - (b.sort ? b.sort : 0);
      });
  }

  refresh(params: any): boolean {
    this.initData(params);
    return true;
  }

  change(value: any[] = []): void {
    let abilities = this.params.data.abilities.map((item: any) => {
      return Object.assign({}, item, { checked: value.indexOf(item.id) >= 0 });
    });
    let newData = Object.assign({}, this.params.data, { abilities });
    this.params.node.setData(newData);
  }
}
