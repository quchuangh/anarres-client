import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule, Type } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import { NumberOutline, FileOutline, FunctionOutline } from '@ant-design/icons-angular/icons';

import { SharedModule } from '@shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SysI18nComponent } from './i18n/i18n.component';
import { SysRolesAbilityCellRendererComponent } from './role/modal/assign/table/ability-cell-renderer/ability-cell-renderer.component';
import { SysRoleAssignComponent } from './role/modal/assign/assign.component';
import { SysRoleAssignAbilityTableComponent } from './role/modal/assign/table/assign-ability-table.component';
import { SysRoleAssignAbilityTreeComponent } from './role/modal/assign/tree/assign-ability-tree.component';
import { SysRoleCreateComponent } from './role/modal/create.component';
import { SysRoleEditComponent } from './role/modal/edit.component';
import { SysRoleViewComponent } from './role/modal/view.component';
import { SysRoutingModule } from './sys-routing.module';

import { SysFileManagerComponent } from './file-manager/file-manager.component';
import { SysLogComponent } from './log/log.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysAbilityComponent } from './ability/ability.component';
import { SysRoleComponent } from './role/role.component';
import { SysUserEditComponent } from './user/edit/edit.component';
import { SysUserComponent } from './user/user.component';
import { SysUserViewComponent } from './user/view/view.component';

const icons: IconDefinition[] = [NumberOutline, FunctionOutline, FileOutline];

const COMPONENTS: Type<void>[] = [
  SysUserComponent,
  SysUserViewComponent,
  SysUserEditComponent,
  SysMenuComponent,
  SysI18nComponent,
  SysAbilityComponent,
  SysLogComponent,
  SysRoleComponent,
  SysFileManagerComponent,
];

const COMPONENTS_NOROUNT: Type<void>[] = [
  SysRoleCreateComponent,
  SysRoleEditComponent,
  SysRoleViewComponent,
  SysRoleAssignComponent,
  SysRoleAssignAbilityTableComponent,
  SysRoleAssignAbilityTreeComponent,
  SysRolesAbilityCellRendererComponent,
];

@NgModule({
  imports: [SharedModule, SysRoutingModule, NzIconModule.forRoot(icons), ScrollingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SysModule {}
