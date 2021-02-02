import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDocxComponent } from './docx/docx.component';
import { FilePdfComponent } from './pdf/pdf.component';
import { FileXlsxComponent } from './xlsx/xlsx.component';

const routes: Routes = [
  { path: 'docx', component: FileDocxComponent },
  { path: 'xlsx', component: FileXlsxComponent },
  { path: 'pdf', component: FilePdfComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileRoutingModule {}
