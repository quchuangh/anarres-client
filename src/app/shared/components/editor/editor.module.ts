import { NgModule } from '@angular/core';
import { FileManagerModule } from '../file-manager';

import { EditorComponent } from './editor.component';

const COMPONENTS = [EditorComponent];

@NgModule({
  imports: [FileManagerModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class EditorModule {}
