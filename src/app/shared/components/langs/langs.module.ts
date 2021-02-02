import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { LangsComponent } from './langs.component';

const COMPONENTS = [LangsComponent];

@NgModule({
  imports: [CommonModule, NzDropDownModule, NzIconModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class LangsModule {}
