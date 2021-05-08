import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbilityCheckInfo, AbilityVO, RoleAbilities, RoleVO } from '@core';
import { ACLService } from '@delon/acl';
import { _HttpClient } from '@delon/theme';

import { ArrayService } from '@delon/util';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree/nz-tree-base-node';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { of } from 'rxjs';

@Component({
  selector: 'app-sys-role-assign-ability-tree',
  templateUrl: './assign-ability-tree.component.html',
  styleUrls: ['./assign-ability-tree.component.less'],
})
export class SysRoleAssignAbilityTreeComponent implements OnInit {
  nodes!: NzTreeNodeOptions[] | NzTreeNode[];

  @Input()
  role!: RoleVO;

  defaultCheckedKeys: string[] = [];
  defaultExpandedKeys: string[] = [];
  defaultSelectedKeys: string[] = [];

  abilities: Array<AbilityVO> = [];

  @ViewChild('tree', { static: true }) tree!: NzTreeComponent;

  constructor(private http: _HttpClient, private aclService: ACLService, private arrayService: ArrayService) {}

  ngOnInit() {
    const can = this.aclService.canAbility('ability:query');

    const roleAbilities$ = can ? this.http.get<Array<AbilityVO>>(`/api/role/${this.role.id}/abilities/full`) : of([]);

    return roleAbilities$.subscribe((abilities) => {
      this.abilities = abilities;
      this.nodes = this.asNode(abilities);
    });
  }

  asNode(abilities: AbilityVO[]): NzTreeNodeOptions[] | NzTreeNode[] {
    return this.arrayService.arrToTreeNode(abilities, {
      titleMapName: 'name',
      parentIdMapName: 'parentId',
      checkedMapname: 'checked',
      disabledMapname: 'disableOpt',
      cb: (item, _parent, deep) => {
        item.expanded = deep <= 1;
      },
    });
  }

  getNewData(): RoleAbilities {
    const abilities = this.abilities.map(
      (value) =>
        ({
          abilityId: value.id,
          licensable: value.licensable,
          checked: value.checked,
        } as AbilityCheckInfo),
    );

    return {
      roleId: this.role.id,
      abilities,
    };
  }

  getChildren(node: NzTreeNode) {
    let nodes: Array<NzTreeNode> = [];
    node.children.forEach((item: any) => {
      nodes.push(item);
      if (item.children && item.children.length) {
        nodes = nodes.concat(this.getChildren(item));
      }
    });
    return nodes;
  }
}
