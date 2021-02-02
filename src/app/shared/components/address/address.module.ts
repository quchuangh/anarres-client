import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';

import { AddressComponent } from './address.component';

const COMPONENTS = [AddressComponent];

@NgModule({
  imports: [CommonModule, FormsModule, NzCascaderModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class AddressModule {}
