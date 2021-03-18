import { AgGridModule } from '@ag-grid-community/angular';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IconDefinition } from '@ant-design/icons-angular';
import { FileExcelOutline, RestOutline, SearchOutline } from '@ant-design/icons-angular/icons';
import { FullContentModule } from '@delon/abc/full-content';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SHARED_ZORRO_MODULES } from '../../shared-zorro.module';
import { AgGridTableComponent } from './grid-table/ag-grid-table.component';
import { AgGridFooterBarComponent } from './inner-tags/ag-grid-footer-bar';
import { AgGridHeaderBarComponent } from './inner-tags/ag-grid-header-bar';
import { AgGridToolBarComponent } from './inner-tags/ag-grid-tool-bar';
import { AgGridQueryFormComponent } from './inner-tags/ag-query-form';
import { DefaultGridStatisticsBarComponent } from './inner-tags/default-impl/default-grid-statistics-bar/default-grid-statistics-bar.component';
import { PaginationContainerComponent } from './inner-tags/default-impl/pagination-container/pagination-container.component';
import { GridLoadingOverlayComponent } from './inner-tags/grid-loading-overlay/grid-loading-overlay.component';
import { NoRowOverlayComponent } from './inner-tags/no-row-overlay/no-row-overlay.component';
// @ts-ignore
LicenseManager.extractExpiry = () => new Date(7287897600000);
LicenseManager.setLicenseKey(
  'For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-21_February_2021_[v2]_MTYxMzg2NTYwMDAwMA==20ec40039842176172fb51be38c13588',
);

const TAG_IMPLS = [PaginationContainerComponent, DefaultGridStatisticsBarComponent, GridLoadingOverlayComponent, NoRowOverlayComponent];
const TAGS = [AgGridQueryFormComponent, AgGridHeaderBarComponent, AgGridToolBarComponent, AgGridFooterBarComponent];

const COMPONENTS = [AgGridTableComponent, ...TAGS, ...TAG_IMPLS];

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
