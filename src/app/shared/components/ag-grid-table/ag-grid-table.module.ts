import { AgGridModule } from '@ag-grid-community/angular';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullContentModule } from '@delon/abc/full-content';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { SHARED_ZORRO_MODULES } from '../../shared-zorro.module';
import { GridStatisticsBarComponent } from './grid-statistics-bar/grid-statistics-bar.component';
import { GridStatusBarComponent } from './grid-status-bar/grid-status-bar.component';
import { GridTableComponent } from './grid-table/grid-table.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { NoRowsOverlayComponent } from './no-rows-overlay/no-rows-overlay.component';
import { TemplateRendererComponent } from './template-renderer/template-renderer.component';

import { IconDefinition } from '@ant-design/icons-angular';
import { FileExcelOutline, RestOutline, SearchOutline } from '@ant-design/icons-angular/icons';
// @ts-ignore
LicenseManager.extractExpiry = () => new Date(7287897600000);
LicenseManager.setLicenseKey(
  'For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-21_February_2021_[v2]_MTYxMzg2NTYwMDAwMA==20ec40039842176172fb51be38c13588',
);

const COMPONENTS = [
  GridTableComponent,
  GridStatisticsBarComponent,
  LoadingOverlayComponent,

  GridStatusBarComponent,
  NoRowsOverlayComponent,

  TemplateRendererComponent,
];

const icons: IconDefinition[] = [SearchOutline, FileExcelOutline, RestOutline];

@NgModule({
  imports: [
    AgGridModule.forRoot([]),
    FullContentModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,

    NzIconModule.forRoot(icons),
    ...SHARED_ZORRO_MODULES,

    TranslateModule,
  ],
  declarations: COMPONENTS,
  exports: [...COMPONENTS],
})
export class AgGridTableModule {}
