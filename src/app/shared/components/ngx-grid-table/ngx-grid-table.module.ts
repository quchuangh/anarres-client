import { AgGridModule } from '@ag-grid-community/angular';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IconDefinition } from '@ant-design/icons-angular';
import { FileExcelOutline, RestOutline, SearchOutline, SwapOutline } from '@ant-design/icons-angular/icons';
import { FullContentModule } from '@delon/abc/full-content';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SHARED_ZORRO_MODULES } from '../../shared-zorro.module';
import { LoadingOverlayComponent } from './inner-tags/loading-overlay/loading-overlay.component';
import { NgxTableFooterComponent } from './inner-tags/ngx-table-footer.component';
import { NgxTableHeaderComponent } from './inner-tags/ngx-table-header.component';
import { NgxTablePaginationComponent } from './inner-tags/ngx-table-pagination.component';
import { NgxTableStatisticsBarComponent } from './inner-tags/ngx-table-statistics-bar.component';
import { NgxTableToolBarComponent } from './inner-tags/ngx-table-tool-bar/ngx-table-tool-bar.component';
import { NoRowOverlayComponent } from './inner-tags/no-row-overlay.component';
import { OperableTextInputComponent } from './inner-tags/operable-text-input/operable-text-input.component';
import { TemplateRendererComponent } from './inner-tags/template-renderer.component';
import { SfQueryFormModule } from './sf-query-form/sf-query-form.module';
import { NgxGridTableComponent } from './table/ngx-grid-table.component';
// @ts-ignore
LicenseManager.extractExpiry = () => new Date(7287897600000);
LicenseManager.setLicenseKey(
  'For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-21_February_2021_[v2]_MTYxMzg2NTYwMDAwMA==20ec40039842176172fb51be38c13588',
);

const TAG_IMPLS = [NgxTablePaginationComponent, NgxTableStatisticsBarComponent];
const TAGS = [NgxTableHeaderComponent, NgxTableToolBarComponent, NgxTableFooterComponent];

const COMPONENTS = [NgxGridTableComponent, LoadingOverlayComponent, NoRowOverlayComponent, ...TAGS, ...TAG_IMPLS];

const icons: IconDefinition[] = [SearchOutline, FileExcelOutline, RestOutline, SwapOutline];

@NgModule({
  imports: [
    AgGridModule.forRoot([]),
    FullContentModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SfQueryFormModule,

    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,

    NzIconModule.forRoot(icons),

    ...SHARED_ZORRO_MODULES,

    TranslateModule,
  ],
  declarations: [...COMPONENTS, TemplateRendererComponent, OperableTextInputComponent],
  exports: [...COMPONENTS, SfQueryFormModule],
})
export class NgxGridTableModule {}
