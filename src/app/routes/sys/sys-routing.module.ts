import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysAbilityComponent } from './ability/ability.component';
import { SysConfigComponent } from './config/config.component';
import { SysDictComponent } from './dict/dict.component';

import { SysFileManagerComponent } from './file-manager/file-manager.component';
import { SysI18nComponent } from './i18n/i18n.component';
import { SysLogComponent } from './log/log.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysOrganizationComponent } from './organization/organization.component';
import { SysPositionComponent } from './position/position.component';
import { SysRoleComponent } from './role/role.component';
import { SysUserEditComponent } from './user/modal/edit.component';
import { SysUserViewComponent } from './user/modal/view.component';
import { SysUserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'user', component: SysUserComponent },
  { path: 'user/:id', component: SysUserViewComponent },
  { path: 'user/edit/:id', component: SysUserEditComponent },
  { path: 'menu', component: SysMenuComponent },
  { path: 'ability', component: SysAbilityComponent },
  { path: 'role', component: SysRoleComponent },
  { path: 'log', component: SysLogComponent },
  { path: 'file-manager', component: SysFileManagerComponent },
  { path: 'i18n', component: SysI18nComponent },
  { path: 'config', component: SysConfigComponent },
  { path: 'dict', component: SysDictComponent },
  { path: 'organization', component: SysOrganizationComponent },
  { path: 'position', component: SysPositionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SysRoutingModule {}
