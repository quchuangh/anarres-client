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
  IGetRowsParams,
  IServerSideGetRowsParams,
  MenuItemDef,
  RowNode,
} from '@ag-grid-community/core';
import { GetContextMenuItems, GetRowNodeIdFunc } from '@ag-grid-community/core/dist/cjs/entities/gridOptions';
import { SideBarDef } from '@ag-grid-community/core/dist/cjs/entities/sideBar';
import { IComponent } from '@ag-grid-community/core/dist/cjs/interfaces/iComponent';
import { IDatasource } from '@ag-grid-community/core/dist/cjs/interfaces/iDatasource';
import { CellRange } from '@ag-grid-community/core/dist/cjs/interfaces/iRangeController';
import { IServerSideDatasource } from '@ag-grid-community/core/dist/cjs/interfaces/iServerSideDatasource';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SkipSelf,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { AllModules } from '@ag-grid-enterprise/all-modules';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService, ACLType } from '@delon/acl';
import { SFComponent, SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';
import { concat, merge, Observable, of, Subject, throwError } from 'rxjs';
import { bufferCount, catchError, filter, map, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { Console } from '../../../utils/console';
// 不要使用import {Console} from '@shared'，防止循环引用
import { transformParams } from '../../../utils/tools';
import { IGridDataSource, IPage, MenuItem, PaginationCfg } from '../grid-model';
import { CellOption, GridStatistics } from '../grid-model';
import { deepEach, getSelectOrRangeSelectNode } from '../grid-utils';
import { PaginationContainerComponent } from '../inner-tags/default-impl/pagination-container/pagination-container.component';
import { GridLoadingOverlayComponent } from '../inner-tags/grid-loading-overlay/grid-loading-overlay.component';
import { NoRowOverlayComponent } from '../inner-tags/no-row-overlay/no-row-overlay.component';
import { GRID_LOCALE_TEXT } from './localeText';

export enum PermissionType {
  'IN' = 'IN',
  'OUT' = 'OUT',
  'GET' = 'GET',
  'POST' = 'POST',
}

@Component({
  selector: 'ag-grid-table',
  templateUrl: './ag-grid-table.component.html',
  styleUrls: ['./ag-grid-table.component.scss'],
})
export class AgGridTableComponent implements OnInit, OnDestroy {
  static DEFAULT_SIDE_BAR = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'columns',
        labelKey: 'columnsTools',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: false,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressSideButtons: false,
          suppressColumnFilter: false,
          suppressColumnSelectAll: false,
          suppressColumnExpandAll: false,
        },
      },
    ],
  };
  static DEFAULT_FRAMEWORK_COMPONENTS = {
    loadingOverlay: GridLoadingOverlayComponent,
    noRowsOverlay: NoRowOverlayComponent,
  };

  // =============================== 表格内部参数 =========================
  /** 一下3个变量是配合reuseTabFix */
  private dispatchFirstDataRendered = false;
  private firstLeavePageTime!: number;
  private firstDataRenderedTime!: number;

  private additionMenu: Array<MenuItem> = [];
  /** 销毁 */
  private destroy$ = new Subject();

  allModules = AllModules;
  fullscreen = false;
  api!: GridApi;
  columnApi!: ColumnApi;
  pageIdx = 1;
  pageSize = 20;
  dataLoading = false;
  loadProgressPercent = 0;
  statistics!: Array<GridStatistics>;
  cur_page!: IPage<any>;
  currentUrl: string;

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
  /** 分页还是无限 */
  @Input() tableModel: 'pageable' | 'infinite' = 'pageable';
  /** 页码和页大小变更时是否自动查询 */
  @Input() autoQueryOnPageChange = true;
  /** 是否显示分页控件 */
  @Input() showPagination: false | PaginationCfg = {};
  /** 是否显示默认状态栏 */
  @Input() defaultStatusBar = false;
  /** 单行还是多行 */
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  /** 是否显示统计 */
  @Input() showStatistics = false;
  /** 是否可以全屏 */
  @Input() fullscreenAction = true;
  /** 导出按钮 */
  @Input() enableExport = true;
  /** 是否展示删除菜单 */
  @Input() deleteMenu = true;
  /** 默认是否可以改变列宽 */
  @Input() resizable = false;
  /** 分组时checkbox是否影响自己的子项 */
  @Input() groupSelectsChildren = true;

  @Input() dataSource!: IGridDataSource;

  // ============================== 事件 ============================
  /** 表格就绪事件 */
  @Output() gridReady = new EventEmitter<{ event: GridReadyEvent; gridTable: AgGridTableComponent }>();
  /** 页码变更事件 */
  @Output() pageIndexChange = new EventEmitter<number>();
  /** 页大小变更事件 */
  @Output() pageSizeChange = new EventEmitter<number>();
  /** 删除事件 */
  @Output() deleted = new EventEmitter<any>();

  constructor(
    private translateService: TranslateService,
    private msg: NzMessageService,
    private modal: NzModalService,
    private reuseTabService: ReuseTabService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: _HttpClient,
    private aclService: ACLService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.buildFrameworkComponents();
    this.buildMenus();
    this.buildStatusBar();
    this.buildSideBar();
    this.buildResizable();
    this.reuseTabFix();
    this.repairRowModeType(); // 修正 rowModelType

    this.showPagination = {
      ...{
        pageSizeOptions: [20, 50, 100, 300, 500, 900],
        size: 'small',
        showSizeChanger: true,
        showQuickJumper: true,
        show: 'bottom',
      },
      ...this.showPagination,
    };
    this.initGridOptions();
  }

  private buildFrameworkComponents(): void {
    if (this.gridOptions.frameworkComponents) {
      this.gridOptions.frameworkComponents = {
        ...AgGridTableComponent.DEFAULT_FRAMEWORK_COMPONENTS,
        ...this.gridOptions.frameworkComponents,
      };
    } else {
      this.gridOptions.frameworkComponents = AgGridTableComponent.DEFAULT_FRAMEWORK_COMPONENTS;
    }
  }

  private buildStatusBar(): void {
    const statusPanels = [];
    if (this.defaultStatusBar) {
      statusPanels.push(
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' },
      );
    }
    if (this.gridOptions.statusBar && this.gridOptions.statusBar.statusPanels.length) {
      this.gridOptions.statusBar.statusPanels.push(...statusPanels);
    } else {
      this.gridOptions.statusBar = { statusPanels };
    }
  }

  private buildMenus(): void {
    let _getContextMenuItems: GetContextMenuItems;
    if (this.gridOptions.getContextMenuItems) {
      _getContextMenuItems = this.gridOptions.getContextMenuItems;
      delete this.gridOptions.getContextMenuItems;
    }

    let contextMenuItemsLabel = {
      'grid.table.columns.autosize': 'grid.table.columns.autosize',
      'grid.table.columns.fit': 'grid.table.columns.fit',
    };

    this.additionMenu.forEach((value) => {
      if (value.name) {
        // @ts-ignore
        contextMenuItemsLabel[value.name] = value.name;
      }
    });

    this.translateService
      .get(['grid.table.columns.autosize', 'grid.table.columns.fit'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((label) => {
        contextMenuItemsLabel = label;
      });

    this.gridOptions.getContextMenuItems = (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
      const selectedData = this.getSelectionData();
      const fixed = [
        {
          icon: '<i class="mdi ag-icon mdi-border-inside"></i>',
          name: contextMenuItemsLabel['grid.table.columns.autosize'],
          action: () => {
            this.columnApi.autoSizeAllColumns();
          },
        },
        {
          icon: '<i class="mdi ag-icon mdi-fit-to-page-outline"></i>',
          name: contextMenuItemsLabel['grid.table.columns.fit'],
          action: () => {
            this.api.sizeColumnsToFit();
          },
        },
        'copy',
      ] as (string | MenuItemDef)[];

      if (this.gridOptions.enableCharts) {
        fixed.push('chartRange');
      }

      if (this.deleteMenu && selectedData.length) {
        fixed.splice(
          0,
          0,
          {
            name: '批量删除',
            tooltip: '删除当前选中行',
            disabled: !(params.node && params.node.data),
            icon: `<i class="mdi ag-icon mdi-delete-sweep"></i>`,
            action: () => this.doDelete(),
          } as MenuItemDef,
          'separator',
        );
      }
      // 用户添加菜单
      const menus: MenuItemDef[] = this.additionMenu.map((value) => {
        const disabled: boolean = !(value.show === 'selected'
          ? params.node && params.node.data
          : value.show(selectedData, params, this.api));
        return {
          ...value,
          action: () => {
            value.callback(params.node.data, params, this.api);
          },
          disabled,
        } as MenuItemDef;
      });
      if (menus.length) {
        fixed.splice(0, 0, ...menus, 'separator');
      }

      if (_getContextMenuItems) {
        const custom = _getContextMenuItems(params) || [];
        if (custom.length) {
          /**
           * 输出之前检查是否同时存在相邻的且相同的menu,去掉其中一个
           * 主要为了防止两个相同的separator
           */
          return custom.concat('separator', fixed).reduce((previousValue, currentValue) => {
            if (previousValue.length && previousValue[previousValue.length - 1] === currentValue) {
              return previousValue;
            }
            // @ts-ignore
            return previousValue.concat(currentValue);
          }, []);
        }
      }
      return fixed;
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
    }
    if (this.tableModel === 'pageable') {
      this.gridOptions.rowModelType = 'clientSide';
    } else {
      this.gridOptions.rowModelType = 'infinite';
      this.showPagination = false;
    }
  }

  private buildSideBar(): void {
    const sideBar = JSON.parse(JSON.stringify(AgGridTableComponent.DEFAULT_SIDE_BAR));
    if (this.gridOptions.sideBar) {
      let toolPanels = sideBar.toolPanels;
      if (typeof this.gridOptions.sideBar === 'string') {
        // todo 整合
      } else if (typeof this.gridOptions.sideBar === 'boolean') {
        // todo 整合
      } else {
        toolPanels = toolPanels.concat(this.gridOptions.sideBar.toolPanels || []);
        this.gridOptions.sideBar = { ...AgGridTableComponent.DEFAULT_SIDE_BAR, ...this.gridOptions.sideBar, toolPanels };
      }
    }
  }

  private reuseTabFix(): void {
    this.router.events
      .pipe(
        filter((evt) => evt instanceof NavigationEnd),
        takeUntil(this.destroy$),
        takeWhile(() => !this.dispatchFirstDataRendered),
      )
      .subscribe(() => {
        const isCurrentPage = this.currentUrl === this.router.url;
        if (!this.firstLeavePageTime && !isCurrentPage) {
          this.firstLeavePageTime = new Date().getTime();
        }
        if (isCurrentPage && this.firstLeavePageTime && this.firstDataRenderedTime) {
          if (this.firstLeavePageTime - this.firstDataRenderedTime < 800) {
            this.api.dispatchEvent({
              type: 'firstDataRendered',
              api: this.api,
              columnApi: this.columnApi,
            } as AgEvent);
            this.dispatchFirstDataRendered = true;
          } else {
            this.dispatchFirstDataRendered = true;
          }
        }
      });
  }

  private buildResizable(): void {
    if (!this.gridOptions.columnDefs) {
      return;
    }

    deepEach(this.gridOptions.columnDefs, (col) => {
      if (typeof col.resizable === 'undefined') {
        col.resizable = this.resizable;
      }
    });
  }
  /**
   * 重建 GridOptions
   * @private
   */
  private initGridOptions(): void {
    const tmpOnReady = this.gridOptions.onGridReady;
    const _this = this;
    this.gridOptions = {
      enableCellChangeFlash: true,
      getRowNodeId: (data) => data.id,
      animateRows: true,
      rowSelection: this.rowSelection,
      localeText: GRID_LOCALE_TEXT, // 国际化文本
      enableRangeSelection: true,
      loadingOverlayComponent: 'loadingOverlay',
      noRowsOverlayComponent: 'noRowsOverlay',
      onGridReady: (event: GridReadyEvent) => {
        _this.onGridReady(event);
        if (tmpOnReady) {
          tmpOnReady(event);
        }
      },
      ...this.gridOptions,
    };
  }

  private onGridReady(event: GridReadyEvent): void {
    this.api = event.api;
    this.columnApi = event.columnApi;

    this.gridReady.emit({ event, gridTable: this });

    this.initDataSource();

    // 当网格数据就绪时
    // this.api.addEventListener('firstDataRendered', () => {
    //   this.firstDataRenderedTime = new Date().getTime();
    //   if (cellActionColumnDefs.length) {
    //     this.columnApi.autoSizeColumn('_action');
    //   }
    // });
    if (this.initLoadData) {
      this.refresh();
    }
  }

  private doDelete(): void {
    const data: any[] = this.getCheckedData();
    if (!data.length) {
      return;
    }
    let mapper: (v: any) => string;
    if (typeof this.gridOptions.getRowNodeId === 'undefined') {
      if (typeof data[0].id !== 'undefined') {
        mapper = (v) => v.id;
      } else {
        console.warn(
          '删除操作无法获取键，默认情况下将获取id作为键，如果没有id字段或不希望使用id作为删除键，请配置 gridOptions.getRowNodeId',
        );
        return;
      }
    } else {
      mapper = this.gridOptions.getRowNodeId;
    }

    const ids: string[] = data.map(mapper);

    this.http.delete(`/api/${this.currentUrl}/deleteByKeys`, { keys: ids }).subscribe((value) => {
      this.deleted.emit(value);
    });
  }

  query(pageIdx: number, size: number): void {}

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
    if (this.autoQueryOnPageChange) {
      this.query(1, size);
    }
  }

  onPageIndexChange(idx: number): void {
    this.pageIndexChange.emit(idx);
    if (this.autoQueryOnPageChange) {
      this.query(idx, this.pageSize);
    }
  }

  fullscreenToggle(): void {
    this.fullscreen = !this.fullscreen;
  }

  exportAllPageData(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setData(data: IPage<any>): void {
    if (this.tableModel === 'pageable') {
      this.cur_page = data;
      this.pageIdx = this.cur_page.current;
      this.pageSize = this.cur_page.size;
      this.api.setRowData(this.cur_page.records);
    } else {
      console.warn('只有 tableModel === ‘pageable’ 才允许直接存值');
    }
  }

  // 添加菜单
  public addMenu(item: MenuItem): void {
    this.additionMenu.push(item);
  }

  // TODO 添加按钮
  public addTopBtn(): void {}

  /**
   * 刷新表格
   */
  public refresh(): void {
    this.query(this.pageIdx, this.pageSize);
  }

  /**
   * 获取所有范围选中（range）的行数据
   */
  public getSelectionData<U>(): U[] {
    return this.getSelection((s) => s.data);
  }

  /**
   * 获取所有范围选中（range）的行，并对其进行转换
   */
  public getSelection<U>(hand: (value: RowNode) => U): U[] {
    const range: CellRange = this.api.getCellRanges()[0];
    const nodes: RowNode[] = this.api.getRenderedNodes();
    if (range && range.startRow && range.endRow) {
      const r = [];
      for (let i = range.startRow.rowIndex; i <= range.endRow.rowIndex; i++) {
        r.push(hand(nodes[i]));
      }
      return r;
    } else {
      return [];
    }
  }

  /**
   * 获取所有checkbox选择的行数据
   */
  public getCheckedData<U>(): U[] {
    return this.getChecked((s) => s.data);
  }

  /**
   * 获取所有checkbox选择的行，并对其进行转换
   */
  public getChecked<U>(hand: (value: RowNode) => U): U[] {
    const nodes: RowNode[] = this.api.getSelectedNodes();
    return nodes.map(hand);
  }

  private initDataSource(): void {
    if (this.tableModel === 'infinite') {
      this.api.setDatasource(
        new (class implements IDatasource {
          getRows(params: IGetRowsParams): void {
            console.log('wx query');
            params.successCallback([], 0);
          }
        })(),
      );
    }
  }
}
