import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { StatusLabelComponent } from './status-label.component';

const COMPONENTS = [StatusLabelComponent];

@NgModule({
  imports: [CommonModule, NzIconModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class StatusLabelModule {}
