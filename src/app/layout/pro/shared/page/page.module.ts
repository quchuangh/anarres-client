import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ProPageGridComponent } from './page-grid.component';
import { ProPageHeaderWrapperComponent } from './page-header-wrapper.component';

const COMPONENTS = [ProPageGridComponent, ProPageHeaderWrapperComponent];

@NgModule({
  imports: [CommonModule, NzSpinModule, PageHeaderModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class ProPageModule {}
