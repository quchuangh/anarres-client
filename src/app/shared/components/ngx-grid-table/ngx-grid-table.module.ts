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
import { TemplateWrapperComponent } from './inner-tags/template-wrapper/template-wrapper.component';
import { NgxGridTableConstants } from './ngx-grid-table-constants';
import { NgxGridTableComponent } from './table/ngx-grid-table.component';
import { NgxGridTablePaginationComponent } from './inner-tags/default-impl/pagination-container/ngx-grid-table-pagination.component';
import { DefaultStatisticsBarComponent } from './inner-tags/default-impl/statistics-bar/default-statistics-bar.component';
import { LoadingOverlayComponent } from './inner-tags/loading-overlay/loading-overlay.component';
import { NgxGridTableFooterComponent } from './inner-tags/ngx-grid-table-footer-bar';
import { NgxGridTableHeaderComponent } from './inner-tags/ngx-grid-table-header';
import { NgxGridTableQueryFormComponent } from './inner-tags/ngx-grid-table-query-form';
import { NgxGridTableToolBarComponent } from './inner-tags/ngx-grid-table-tool-bar';
import { NoRowOverlayComponent } from './inner-tags/no-row-overlay/no-row-overlay.component';
import { QueryFormComponent } from './inner-tags/query-form/query-form.component';
import { TemplateRendererComponent } from './inner-tags/template-renderer/template-renderer.component';
// @ts-ignore
LicenseManager.extractExpiry = () => new Date(7287897600000);
LicenseManager.setLicenseKey(
  'For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-21_February_2021_[v2]_MTYxMzg2NTYwMDAwMA==20ec40039842176172fb51be38c13588',
);

const TAG_IMPLS = [NgxGridTablePaginationComponent, DefaultStatisticsBarComponent];
const TAGS = [NgxGridTableQueryFormComponent, NgxGridTableHeaderComponent, NgxGridTableToolBarComponent, NgxGridTableFooterComponent];

const COMPONENTS = [NgxGridTableComponent, TemplateWrapperComponent, LoadingOverlayComponent, NoRowOverlayComponent, ...TAGS, ...TAG_IMPLS];

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
  declarations: [...COMPONENTS, QueryFormComponent, TemplateRendererComponent],
  exports: [...COMPONENTS],
})
export class NgxGridTableModule {}
