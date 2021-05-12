import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysConfigComponent } from './config/config.component';
import { SysDictComponent } from './dict/dict.component';

import { SysFileManagerComponent } from './file-manager/file-manager.component';
import { SysI18nComponent } from './i18n/i18n.component';
import { SysLogComponent } from './log/log.component';
import { SysMenuComponent } from './menu/menu.component';
import { SysAbilityComponent } from './ability/ability.component';
import { SysRoleComponent } from './role/role.component';
import { SysUserEditComponent } from './user/edit/edit.component';
import { SysUserComponent } from './user/user.component';
import { SysUserViewComponent } from './user/view/view.component';

const routes: Routes = [
  { path: 'user', component: SysUserComponent },
  { path: 'user/:id', component: SysUserViewComponent },
  { path: 'user/edit/:id', component: SysUserEditComponent },
  { path: 'menu', component: SysMenuComponent },
  { path: 'permission', component: SysAbilityComponent },
  { path: 'role', component: SysRoleComponent },
  { path: 'log', component: SysLogComponent },
  { path: 'file-manager', component: SysFileManagerComponent },
  { path: 'i18n', component: SysI18nComponent },
  { path: 'config', component: SysConfigComponent },
  { path: 'dict', component: SysDictComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SysRoutingModule {}
