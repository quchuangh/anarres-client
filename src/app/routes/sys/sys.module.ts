import { NgModule, Type } from '@angular/core';

import { SharedModule } from '@shared';
import {SysI18nComponent} from './i18n/i18n.component';
import { SysRoutingModule } from './sys-routing.module';

import { SysFileManagerComponent } from './file-manager/file-manager.component';
import { SysLogComponent } from './log/log.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysPermissionComponent } from './permission/permission.component';
import { SysRoleComponent } from './role/role.component';
import { SysUserEditComponent } from './user/edit/edit.component';
import { SysUserComponent } from './user/user.component';
import { SysUserViewComponent } from './user/view/view.component';

const COMPONENTS: Type<void>[] = [
  SysUserComponent,
  SysUserViewComponent,
  SysUserEditComponent,
  SysMenuComponent,
  SysI18nComponent,
  SysPermissionComponent,
  SysLogComponent,
  SysRoleComponent,
  SysFileManagerComponent,
];

const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, SysRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SysModule {}
