import { NgModule } from '@angular/core';

import { MouseFocusDirective } from './mouse-focus.directive';

const COMPONENTS = [MouseFocusDirective];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class MouseFocusModule {}
