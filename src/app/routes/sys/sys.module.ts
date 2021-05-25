import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule, Type } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import { FileOutline, FunctionOutline, NumberOutline, SaveOutline } from '@ant-design/icons-angular/icons';

import { SharedModule } from '@shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SysConfigComponent } from './config/config.component';
import { SysConfigCreateAndUpdateComponent } from './config/modal/create-update.component';

import { SysConfigViewComponent } from './config/modal/view.component';
import { SysDictComponent } from './dict/dict.component';
import { SysDictItemComponent } from './dict/item/dict-item.component';
import { SysDictItemCreateComponent } from './dict/item/modal/create.component';
import { SysDictItemEditComponent } from './dict/item/modal/edit.component';
import { SysDictItemViewComponent } from './dict/item/modal/view.component';
import { SysDictAddItemComponent } from './dict/modal/add-item.component';
import { SysDictCreateComponent } from './dict/modal/create.component';
import { SysDictEditComponent } from './dict/modal/edit.component';
import { SysDictViewComponent } from './dict/modal/view.component';
import { SysI18nComponent } from './i18n/i18n.component';
import { SysOrganizationComponent } from './organization/organization.component';
import { SysPositionCreateComponent } from './position/modal/create.component';
import { SysPositionEditComponent } from './position/modal/edit.component';
import { SysPositionViewComponent } from './position/modal/view.component';
import { SysPositionComponent } from './position/position.component';
import { SysRoleAssignComponent } from './role/modal/assign/assign.component';
import { SysRolesAbilityCellRendererComponent } from './role/modal/assign/table/ability-cell-renderer/ability-cell-renderer.component';
import { SysRoleAssignAbilityTableComponent } from './role/modal/assign/table/assign-ability-table.component';
import { SysRoleAssignAbilityTreeComponent } from './role/modal/assign/tree/assign-ability-tree.component';
import { SysRoleCreateComponent } from './role/modal/create.component';
import { SysRoleEditComponent } from './role/modal/edit.component';
import { SysRoleViewComponent } from './role/modal/view.component';
import { SysRoutingModule } from './sys-routing.module';

import { SysAbilityComponent } from './ability/ability.component';
import { SysFileManagerComponent } from './file-manager/file-manager.component';
import { SysLogComponent } from './log/log.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysRoleComponent } from './role/role.component';
import { SysUserAppointmentComponent } from './user/modal/appointment.component';
import { SysUserCreateComponent } from './user/modal/create.component';
import { SysUserEditComponent } from './user/modal/edit.component';
import { SysUserJoinGroupComponent } from './user/modal/join-group.component';
import { SysUserComponent } from './user/user.component';
import { SysUserViewComponent } from './user/modal/view.component';
import { SysUserAssignComponent } from './user/modal/assign.component';
import { SysUserChangePwdComponent } from './user/modal/change-pwd.component';

const icons: IconDefinition[] = [NumberOutline, FunctionOutline, FileOutline, SaveOutline];

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
  SysConfigComponent,
  SysDictComponent,
  SysOrganizationComponent,
  SysPositionComponent,
];

const COMPONENTS_NOROUNT: Type<void>[] = [
  SysRoleCreateComponent,
  SysRoleEditComponent,
  SysRoleViewComponent,
  SysRoleAssignComponent,
  SysRoleAssignAbilityTableComponent,
  SysRoleAssignAbilityTreeComponent,
  SysRolesAbilityCellRendererComponent,

  SysConfigViewComponent,
  SysConfigCreateAndUpdateComponent,

  SysDictViewComponent,
  SysDictEditComponent,
  SysDictCreateComponent,
  SysDictAddItemComponent,

  SysDictItemCreateComponent,
  SysDictItemEditComponent,
  SysDictItemViewComponent,
  SysDictItemComponent,

  SysUserEditComponent,
  SysUserViewComponent,
  SysUserCreateComponent,
  SysUserChangePwdComponent,
  SysUserAssignComponent,
  SysUserAppointmentComponent,
  SysUserJoinGroupComponent,

  SysPositionCreateComponent,
  SysPositionEditComponent,
  SysPositionViewComponent,
];

@NgModule({
  imports: [SharedModule, SysRoutingModule, NzIconModule.forRoot(icons), ScrollingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SysModule {}
