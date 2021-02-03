import {AgGridModule} from '@ag-grid-community/angular';
import {CommonModule} from '@angular/common';
import { NgModule } from '@angular/core';
import {GridStatisticsBarComponent} from './grid-statistics-bar/grid-statistics-bar.component';
import {GridStatusBarComponent} from './grid-status-bar/grid-status-bar.component';
import {GridTableComponent} from './grid-table/grid-table.component';
import {LoadingOverlayComponent} from './loading-overlay/loading-overlay.component';
import {NoRowsOverlayComponent} from './no-rows-overlay/no-rows-overlay.component';
import {TemplateRendererComponent} from './template-renderer/template-renderer.component';

const COMPONENTS = [
  GridTableComponent,
  GridStatisticsBarComponent,
  GridStatusBarComponent,
  TemplateRendererComponent,
  LoadingOverlayComponent,
  NoRowsOverlayComponent,
];

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.forRoot([])
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class AgGridExtModule {}
