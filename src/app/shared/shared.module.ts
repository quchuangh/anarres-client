import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';

import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

// #region third libs
import { DragDropModule } from '@angular/cdk/drag-drop';

const THIRDMODULES = [DragDropModule];
// #endregion

// #region your componets & directives
import { PRO_SHARED_MODULES } from '../layout/pro';
import { AddressModule } from './components/address';
import { DelayModule } from './components/delay';
import { EditorModule } from './components/editor';
import { FileManagerModule } from './components/file-manager';
import { MasonryModule } from './components/masonry';
import { MouseFocusModule } from './components/mouse-focus';
import { ScrollbarModule } from './components/scrollbar';
import { StatusLabelModule } from './components/status-label';

const MODULES = [
  AddressModule,
  DelayModule,
  EditorModule,
  FileManagerModule,
  MasonryModule,
  MouseFocusModule,
  ScrollbarModule,
  StatusLabelModule,
  ...PRO_SHARED_MODULES,
];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    ...MODULES,
    // third libs
    ...THIRDMODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    ...MODULES,
    // third libs
    ...THIRDMODULES,
  ],
})
export class SharedModule {}
