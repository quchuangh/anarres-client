import { NgModule } from '@angular/core';

import { ScrollbarDirective } from './scrollbar.directive';

const COMPONENTS = [ScrollbarDirective];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class ScrollbarModule {}
