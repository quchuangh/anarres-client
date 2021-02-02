import { NgModule } from '@angular/core';

import { DelayDirective } from './delay.directive';

const COMPONENTS = [DelayDirective];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class DelayModule {}
