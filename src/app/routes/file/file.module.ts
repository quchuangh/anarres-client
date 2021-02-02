import { NgModule, Type } from '@angular/core';

import { SharedModule } from '@shared';
import { FileRoutingModule } from './file-routing.module';

import { FileDocxComponent } from './docx/docx.component';
import { FilePdfComponent } from './pdf/pdf.component';
import { FileXlsxComponent } from './xlsx/xlsx.component';

const COMPONENTS: Type<void>[] = [FileDocxComponent, FileXlsxComponent, FilePdfComponent];

const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, FileRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class FileModule {}
