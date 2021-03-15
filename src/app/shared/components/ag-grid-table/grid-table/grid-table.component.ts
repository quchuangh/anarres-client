import { AgGridAngular } from '@ag-grid-community/angular';
import {
  AgEvent,
  ColDef,
  ColGroupDef,
  ColumnApi,
  Constants,
  ExcelCell,
  GetContextMenuItemsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideGetRowsParams,
  MenuItemDef,
  RowNode,
} from '@ag-grid-community/core';
import { GetContextMenuItems } from '@ag-grid-community/core/dist/cjs/entities/gridOptions';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { AllModules } from '@ag-grid-enterprise/all-modules';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService, ACLType } from '@delon/acl';
import { SFComponent, SFSchema } from '@delon/form';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';
import { concat, merge, Observable, of, Subject, throwError } from 'rxjs';
import { bufferCount, catchError, filter, map, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { Console } from '../../../utils/console';
// 不要使用import {Console} from '@shared'，防止循环引用
import { transformParams } from '../../../utils/tools';
import { IPage } from '../grid-model';
import { CellOption, GridStatistics } from '../grid-table';
import { getSelectOrRangeSelectNode } from '../grid-utils';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { NoRowsOverlayComponent } from '../no-rows-overlay/no-rows-overlay.component';
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component';
import { GRID_LOCALE_TEXT } from './localeText';

export enum PermissionType {
  'IN' = 'IN',
  'OUT' = 'OUT',
  'GET' = 'GET',
  'POST' = 'POST',
}

@Component({
  selector: 'grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
})
export class GridTableComponent implements OnInit, OnDestroy {
  // =============================== 表格内部参数 =========================
  _gridOptions!: GridOptions;
  allModules = AllModules;
  currentUrl;
  fullscreen = false;
  api!: GridApi;
  columnApi!: ColumnApi;

  // ================================== 基本配置（外部） =============================
  /** 表格基础配置 */
  @Input() gridOptions!: GridOptions;
  /** 表格主题 */
  @Input() gridTheme = 'ag-theme-balham';
  /** 表格CSS */
  @Input() gridTableClass = [];
  /** 数据表格样式 */
  @Input() gridTableStyle: { [key: string]: any } = { width: '100%', height: '100%' };
  /** 是否在表格初始化后立即执行一次查询 */
  @Input() initLoadData = true;
  /** 展示分页 */
  @Input() showPageBar: boolean | 'top' | 'both' = true;
  /** 分页还是无限 */
  @Input() tableModel: 'pageable' | 'infinite' = 'pageable';

  // ============================== 事件 ============================
  @Output() onGridReady = new EventEmitter<{ event: GridReadyEvent; gridTable: GridTableComponent }>();

  // ============================= 临时变量 ============================
  tmp_CurPage!: IPage<any>;

  constructor(
    private translateService: TranslateService,
    private msg: NzMessageService,
    private modal: NzModalService,
    private reuseTabService: ReuseTabService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private aclService: ACLService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initGridOptions();
  }

  ngOnDestroy(): void {}

  /**
   * 重建 GridOptions
   * @private
   */
  private initGridOptions(): void {
    this.repairRowModeType(); // 修正 rowModelType

    this._gridOptions = {
      onGridReady: (event: GridReadyEvent) => this._onGridReady(event),
      ...this.gridOptions,
    };
  }

  /**
   * 检查 rowModelType, 如果设定了这个值, 则在控制台给出debug信息提示开发者
   * tableModel 为 pageable 时，rowModelType 将设定为 ’clientSide‘
   * tableModel 为 infinite 时，rowModelType 将设定为 ’infinite‘
   */
  private repairRowModeType(): void {
    const rowModelType = this.gridOptions.rowModelType;
    if (rowModelType) {
      console.warn(`
        GridTable 对数据的查询委托给了开发者，所以不再纠结于rowModelType是 serverSide 还是 clientSide. 这由开发者自行决定。
        加上viewport类型过于复杂难用。因此, 我们不再接受AgGrid中的 rowModelType 概念. 而是将表格的展示方式抽象成了 ‘分页’和‘无限’ 两种模式，
        用户可以通过 tableModel 进行设定。默认为分页模式。分页模式下 showPageBar 永远为false
      `);
      this.gridOptions.rowModelType = undefined;
    }
    if (this.tableModel === 'pageable') {
      this.gridOptions.rowModelType = 'clientSide';
    } else {
      this.gridOptions.rowModelType = 'infinite';
    }
  }

  private _onGridReady(event: GridReadyEvent): void {
    this.api = event.api;
    this.columnApi = event.columnApi;

    if (this.gridOptions.onGridReady) {
      this.gridOptions.onGridReady(event);
    }
    this.onGridReady.emit({ event, gridTable: this });

    if (this.initLoadData) {
      // TODO 查询
    }

    // this.api.addEventListener('firstDataRendered', e => {
    //   this.firstDataRenderedTime = new Date().getTime();
    //   if (cellActionColumnDefs.length) {
    //     this.columnApi.autoSizeColumn('_action');
    //   }
    // });
    //
  }

  public setData(data: IPage<any>): void {
    this.tmp_CurPage = data;
    this.api.setRowData(this.tmp_CurPage.records);
  }
}
