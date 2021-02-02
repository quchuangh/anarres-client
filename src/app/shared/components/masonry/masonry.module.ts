import { NgModule } from '@angular/core';

import { MasonryDirective } from './masonry.directive';

const COMPONENTS = [MasonryDirective];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class MasonryModule {}
