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
  RowNode
} from '@ag-grid-community/core';
import {GetContextMenuItems} from '@ag-grid-community/core/dist/cjs/entities/gridOptions';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';

import {AllModules} from '@ag-grid-enterprise/all-modules';


import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import {ACLService, ACLType} from '@delon/acl';
import {SFComponent, SFSchema} from '@delon/form';
import {TranslateService} from '@ngx-translate/core';
// 不要使用import {Console} from '@shared'，防止循环引用
import {Console} from '@shared';
import {arrayPartition, transformParams} from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';
import {concat, merge, Observable, of, Subject, throwError} from 'rxjs';
import {bufferCount, catchError, filter, map, switchMap, takeUntil, takeWhile, tap} from 'rxjs/operators';
import {LoadingOverlayComponent} from '..';
import {NoRowsOverlayComponent} from '..';
import {TemplateRendererComponent} from '..';
import {getSelectOrRangeSelectNode} from '..';
import {CellOption, GridStatistics} from '../grid-table';
import {GRID_LOCALE_TEXT} from './localeText';

export enum PermissionType {
  'IN' = 'IN',
  'OUT' = 'OUT',
  'GET' = 'GET',
  'POST' = 'POST'
}

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
})
export class GridTableComponent implements OnInit, OnDestroy {
  private rowModelType: string | 'serverSide' | undefined;
  private treeData: boolean | undefined;
  _gridOptions: GridOptions | undefined;


  allModules = AllModules;

  private rowData: any[] = [];

  /**
   * 表格名称
   * 导出时作为文件名
   */
  @Input() name = '';

  /**
   * 表格唯一主键
   */
  @Input() key: string | number = Math.floor(Math.random() * 1000000) + '_' + (new Date().getTime() - 1564366251225);

  /**
   * 当网格准备就绪时是否立即请求数据
   */
  @Input() initLoadData = true;

  @Input() gridOptions: GridOptions | undefined;

  @Input() gridTheme = 'ag-theme-balham';

  @Input() gridTableClass = [];

  /**
   * 搜索条件组件
   */
  @Input() searchSchema: SFSchema | undefined;


  /**
   * 搜索表单默认值
   */
  @Input() searchFormData = {};

  /**
   * 数据表格样式
   */
  @Input() gridTableStyle: { [key: string]: any } = {width: '100%', height: '100%'};

  /**
   * 是否显示表格底部 包含分页和操作区域
   */
  @Input() showFooter = true;


  /**
   * 是否显示表格底部的操作区域
   */
  @Input() showFooterAction: false | { [key: string]: boolean } = {export: true, fullscreen: true};


  @Input() footerAction: TemplateRef<{}> | undefined;


  @Input() headerAction: TemplateRef<{}> | undefined;


  /**
   * 单元格操作区
   */
  @Input() cellAction: CellOption | null = null;
  /**
   * 是否存在统计数据
   */
  @Input() hasGridStatistics = false;

  /**
   * 是否显示默认页脚
   */
  @Input() showDefaultStatusBar = false;


  @Input() gridAlignedGrids: TemplateRef<{}> | undefined;


  /**
   * 分页设定组件参数
   */
  @Input() gridTablePagination: false | { [key: string]: any } = {
    size: 'small',
    showSizeChanger: true,
    showQuickJumper: true
  };

  @Input() searchPermission: string | undefined;


  /**
   * 根据 searchPermission 自动为搜索条件添加权限控制
   */
  @Input() autoSearchACL = true;

  /**
   * 根据 searchPermission 自动为搜索结果添加权限控制
   */
  @Input() autoColumnACL = true;


  /**
   * 是否全屏显示
   */
  @Input() fullscreen = false;

  /**
   * total=总数据条数
   * items=当前页数据
   * footerItems=页脚数据
   */
  @Input() getData: ((params: { [key: string]: any; }) => Observable<{ total: number; items: any[]; statistics?: Array<GridStatistics>; }>) | undefined ;


  /**
   * 删除方法
   */
  @Input() deleteFunc: ((node: RowNode) => Observable<void>) | undefined;

  /**
   * 右键菜单上显示批量删除
   */
  @Input() showContextMenuDeleteBatch = true;


  @Input() serverSort = true;


  /**
   * 启用复选框
   */
  @Input() checkboxEnable = false;


  @Output()
  pageIndexChange = new EventEmitter<number>();

  @Output()
  pageSizeChange = new EventEmitter<number>();

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onGridReady = new EventEmitter<{ event: GridReadyEvent, gridTable: GridTableComponent }>();

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onDelete = new EventEmitter<RowNode[] | boolean>();

  defaultStatusPanels = [
    {statusPanel: 'agFilteredRowCountComponent'},
    {statusPanel: 'agSelectedRowCountComponent'},
    {statusPanel: 'agAggregationComponent'}
  ];


  defaultFrameworkComponents: any = {
    loadingOverlay: LoadingOverlayComponent,
    noRowsOverlay: NoRowsOverlayComponent
  };


  currentPage = this.gridTablePagination && this.gridTablePagination.initIndex ? this.gridTablePagination.initIndex : 1;

  pageSizeOptions = this.gridTablePagination && this.gridTablePagination.pageSizeOptions ? this.gridTablePagination.pageSizeOptions : [100, 300, 500, 900];

  currentPageSize = this.gridTablePagination && this.gridTablePagination.initPageSize ? this.gridTablePagination.initPageSize : this.pageSizeOptions[0];

  total = 0;

  destroy$ = new Subject();

  next$ = new Subject<{ [key: string]: any }>();

  showProgress = false;

  progressPercent = 0;

  progressStatus: NzProgressStatusType = 'normal';


  selectedNodes: RowNode[] = [];

  dataLoading = false;

  sideBar = {
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
          suppressColumnExpandAll: false
        }
      }
    ]
  };


  api: GridApi | undefined;

  columnApi: ColumnApi | undefined;

  statistics: Array<GridStatistics> | undefined;

  contextMenuItemsLabel = {
    'grid.table.columns.autosize': 'grid.table.columns.autosize',
    'grid.table.columns.fit': 'grid.table.columns.fit'
  };

  currentUrl: string | undefined;

  firstDataRenderedTime: number | undefined;
  firstLeavePageTime: number | undefined;
  dispatchFirstDataRendered = false;
  @ViewChild('sf', {static: false}) sf: SFComponent | undefined;


  @ViewChild('actionCell', {static: true}) actionCell: TemplateRef<any> | undefined;


  @ViewChild('deleteContent', {static: true}) deleteContent: TemplateRef<any> | undefined;

  constructor(private translateService: TranslateService,
              private msg: NzMessageService,
              private modal: NzModalService,
              private reuseTabService: ReuseTabService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private aclService: ACLService) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    const t = this;
    if (this.autoSearchACL) {
      this.searchACL();
    }
    this.rowModelType = t.gridOptions?.rowModelType || Constants.ROW_MODEL_TYPE_CLIENT_SIDE;
    this.treeData = t.gridOptions?.treeData || false;
    this.nextDataSubscribe();
    this.reuseTabFix();

    let _getContextMenuItems: GetContextMenuItems;
    if (this.gridOptions?.getContextMenuItems) {
      _getContextMenuItems = this.gridOptions.getContextMenuItems;
      delete this.gridOptions.getContextMenuItems;
    }
    this.translateService.get(['grid.table.columns.autosize', 'grid.table.columns.fit']).pipe(takeUntil(this.destroy$)).subscribe(label => {
      this.contextMenuItemsLabel = label;
    });
    const getContextMenuItems = (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
      const fixed = [{
        icon: '<i class="mdi ag-icon mdi-border-inside"></i>',
        name: t.contextMenuItemsLabel['grid.table.columns.autosize'],
        action: () => {
          this.columnApi?.autoSizeAllColumns();
        }
      }, {
        icon: '<i class="mdi ag-icon mdi-fit-to-page-outline"></i>',
        name: t.contextMenuItemsLabel['grid.table.columns.fit'],
        action: () => {
          this.api?.sizeColumnsToFit();

        }
      }, 'copy'] as (string | MenuItemDef)[];
      if (this.gridOptions?.enableCharts) {
        fixed.push('chartRange');
      }
      if (this.deleteFunc && this.showContextMenuDeleteBatch) {
        fixed.splice(0, 0, {
          name: '批量删除',
          tooltip: '删除当前选中行',
          disabled: !(params.node && params.node.data),
          icon: `<i class="mdi ag-icon mdi-delete-sweep"></i>`,
          action: () => {
            // @ts-ignore
            this.deleteBatch().subscribe(next => {
              this.onDelete.emit(next);
            });
          }
        } as MenuItemDef, 'separator');
      }
      if (_getContextMenuItems) {
        const custom = (_getContextMenuItems(params) || []);
        if (custom.length) {
          /**
           * 输出之前检查是否同时存在相邻的且相同的menu,去掉其中一个
           * 主要为了防止两个相同的separator
           */

          return custom.concat('separator', fixed).reduce(((previousValue: any[], currentValue: string| MenuItemDef) => {
            if (previousValue.length && previousValue[previousValue.length - 1] === currentValue) {
              return previousValue;
            }
            return previousValue.concat(currentValue);
          }), []);

        }
      }
      return fixed;
    };

    if (this.gridOptions?.frameworkComponents) {
      this.gridOptions.frameworkComponents = {
        ...this.defaultFrameworkComponents,
        ...this.gridOptions.frameworkComponents
      };
    } else {
      // @ts-ignore
      this.gridOptions?.frameworkComponents = this.defaultFrameworkComponents;
    }
    this.buildStatusBar();


    let sideBar = JSON.parse(JSON.stringify(this.sideBar));
    if (this.gridOptions?.sideBar) {
      let toolPanels = sideBar.toolPanels;
      if (typeof this.gridOptions.sideBar === 'string') {
        // todo 整合
      } else if (typeof this.gridOptions.sideBar === 'boolean') {
        // todo 整合
      } else {
        toolPanels = toolPanels.concat(this.gridOptions.sideBar.toolPanels || []);
        sideBar = {...this.sideBar, ...this.gridOptions.sideBar, toolPanels};
        delete this.gridOptions.sideBar;
      }
    }
    let defaultColDef = {
      resizable: true
    };
    if (this.checkboxEnable) {
      Object.assign(defaultColDef, {
        // tslint:disable-next-line:typedef
        checkboxSelection(params: any) {
          const displayedColumn = params.columnApi.getAllDisplayedColumns();
          return params.column === displayedColumn[0];
        },
        // tslint:disable-next-line:typedef
        headerCheckboxSelection(params: any) {
          const displayedColumn = params.columnApi.getAllDisplayedColumns();
          return params.column === displayedColumn[0];
        }
      });
    }
    if (this.gridOptions?.defaultColDef) {
      defaultColDef = {...defaultColDef, ...this.gridOptions.defaultColDef};
      delete this.gridOptions.defaultColDef;
    }
    let onGridReady: any;
    if (this.gridOptions?.onGridReady) {
      onGridReady = this.gridOptions.onGridReady;
      delete this.gridOptions.onGridReady;
    }
    let onSortChanged: any;
    if (this.gridOptions?.onSortChanged) {
      onSortChanged = this.gridOptions.onSortChanged;
      delete this.gridOptions.onSortChanged;
    }

    const cellActionColumnDefs: (ColDef | ColGroupDef)[] = [];
    if (this.cellAction && this.cellAction.action) {
      const cell = {
        field: '_action',
        chartDataType: 'excluded',
        headerName: this.cellAction.headerName,
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {ngTemplate: this.actionCell},
        sortable: false,
        suppressSizeToFit: true
      } as ColDef;
      cellActionColumnDefs.push(cell);
      if (this.gridOptions) {
        if (this.cellAction.first === false) {
          // @ts-ignore
          this.gridOptions.columnDefs.push(...cellActionColumnDefs);
        } else {
          // @ts-ignore
          this.gridOptions.columnDefs = cellActionColumnDefs.concat(this.gridOptions.columnDefs);
        }
      }
    }

    if (this.autoColumnACL && this.gridOptions) {
      // @ts-ignore
      this.gridOptions.columnDefs = this.columnACL(this.gridOptions.columnDefs);
    }
    this._gridOptions = {
      enableCellChangeFlash: true,
      getRowNodeId: (data) => data.id,
      animateRows: true,
      localeText: GRID_LOCALE_TEXT,
      getContextMenuItems,
      loadingOverlayComponent: 'loadingOverlay',
      noRowsOverlayComponent: 'noRowsOverlay',
      sideBar,
      defaultColDef,
      enableRangeSelection: true,
      onSortChanged: (params) => {
        if (this.serverSort && this.rowModelType === Constants.ROW_MODEL_TYPE_CLIENT_SIDE) {
          this.refreshRowsData();
        }
        if (onSortChanged) {
          onSortChanged(params);
        }
      },
      onGridReady: (event: GridReadyEvent) => {
        this.api = event.api;
        this.columnApi = event.columnApi;

        this.api.addEventListener('firstDataRendered',  () => {
          this.firstDataRenderedTime = new Date().getTime();
          if (cellActionColumnDefs.length) {
            this.columnApi?.autoSizeColumn('_action');
          }
        });

        if (this.initLoadData) {
          this.searchRowsData();
        }
        if (onGridReady) {
          onGridReady(event, this);
        }
        this.onGridReady.emit({event, gridTable: this});
      },
      ...this.gridOptions
    };

  }


  /**
   * 修复因为tab页模式带来的表格布局问题
   * 快速切换tab页时，如果表格还没有准备就绪，基于数据长度和页面长度自动绘制列宽会失败，造成列挤压在一起
   */
  reuseTabFix(): void {
    this.router.events.pipe(filter(evt => evt instanceof NavigationEnd), takeUntil(this.destroy$), takeWhile(() => !this.dispatchFirstDataRendered))
      .subscribe(() => {
        const isCurrentPage = this.currentUrl === this.router.url;
        if (!this.firstLeavePageTime && !isCurrentPage) {
          this.firstLeavePageTime = new Date().getTime();
        }
        if (isCurrentPage && this.firstLeavePageTime && this.firstDataRenderedTime) {
          if (this.firstLeavePageTime - this.firstDataRenderedTime < 800) {
            this.api?.dispatchEvent({type: 'firstDataRendered', api: this.api, columnApi: this.columnApi} as AgEvent);
            this.dispatchFirstDataRendered = true;
          } else {
            this.dispatchFirstDataRendered = true;
          }
        }
      });
  }

  /**
   * 为搜索参数列表加上权限控制,跳过已存在权限配置或ui=== 'string' 的字段
   */
  private searchACL(): void {
    const inPermission = `${this.searchPermission}:${PermissionType.IN}:`;
    if (this.searchPermission && this.searchSchema) {
      const abilities = this.aclService.data.abilities || [];
      if (abilities.some(item => (item + '').startsWith(inPermission))) {
        // @ts-ignore
        const properties: {} = this.searchSchema.properties;
        Object.keys(properties).forEach(key => {
          // @ts-ignore
          const ui = properties[key].ui || {};
          if (typeof ui === 'object' && !ui.acl) {
            const permission = inPermission + key;
            ui.acl = {ability: [permission]} as ACLType;
          }
        });
      }
    }
  }


  /**
   * 判断是否具有列权限,对于field为空或field已_开头的列认为是自定义列,不受权限控制
   * @param colDefs 权限
   */
  private columnACL(colDefs: ColDef[]): ColDef[] {
    const outPermission = `${this.searchPermission}:${PermissionType.OUT}:`;
    const abilities = this.aclService.data.abilities || [];
    if (abilities.some(item => (item + '').startsWith(outPermission))) {
      return colDefs.filter(col => {
        const field = col.field;
        if (!field || field.startsWith('_')) {
          return true;
        }
        const permission = outPermission + field;
        return this.aclService.canAbility(permission);
      });
    }
    return colDefs;
  }

  private buildStatusBar(): void {
    const statusPanels = [];
    if (this.showDefaultStatusBar) {
      statusPanels.push(...this.defaultStatusPanels);
    }
    if (this.gridOptions) {
      if (this.gridOptions.statusBar && this.gridOptions.statusBar.statusPanels.length) {
        this.gridOptions.statusBar.statusPanels.push(...statusPanels);
      } else {
        this.gridOptions.statusBar = {statusPanels};
      }
    }

  }

  private nextDataSubscribe(): void {
    this.next$.subscribe((response = {}) => {
      const queryParams = response;
      if (this.rowModelType === Constants.ROW_MODEL_TYPE_SERVER_SIDE) {
        this.serverSideData(queryParams);
      } else {
        this.serverClientData(queryParams);
      }
    });
  }


  /**
   * 服务端模式从服务端获取数据
   */
  private serverSideData(queryParams: {}): void {
    const getRows = (params: IServerSideGetRowsParams): void => {
      if (this.treeData === true) {
        const groupKeys = params.request.groupKeys;

        Object.assign(queryParams, {groupKeys});
      }
      const sort = params.request.sortModel;
      if (sort.length) {
        Object.assign(queryParams, {sortField: sort[0].colId, sortMethod: (sort[0].sort).toLowerCase()});
      }
      const startRow = params.request.startRow;
      const endRow = params.request.endRow;
      const pageSize = endRow - startRow;
      const page = startRow / pageSize + 1;
      Object.assign(queryParams, {size: pageSize, current: page});
      Console.collapse('grid-table.component getData', 'indigoBg', 'queryParams', 'indigoOutline');
      console.log(queryParams);
      console.groupEnd();
      this.dataLoading = true;
      this.api?.showLoadingOverlay();
      if (this.getData) {
        this.getData({...queryParams})
          .pipe(takeUntil(this.destroy$), catchError(err => {
            Console.collapse('grid-table.component RefreshRowsData', 'redBg', 'ERROR', 'redOutline');
            console.error(err);
            console.groupEnd();
            return of({total: 0, items: [], statistics: []});
          }))
          .subscribe(response => {
            this.rowData = response.items;
            params.successCallback(response.items, response.total);
            this.statistics = response.statistics || [];
            this.total = response.total;

            if (!response.items.length && !this.treeData) {
              this.api?.showNoRowsOverlay();
            } else {
              this.api?.hideOverlay();
            }
            this.dataLoading = false;
          });
      }
    };
    this.api?.showLoadingOverlay();
    this.api?.setServerSideDatasource({getRows});
  }

  /**
   * 客户端模式从服务端获取数据
   */
  private serverClientData(queryParams: {}): void {
    this.rowData = [];
    const sort: { colId: string; sort: string }[] | undefined = this.api?.getSortModel();
    if (sort?.length) {
      Object.assign(queryParams, {sortField: sort[0].colId, sortMethod: (sort[0].sort).toLowerCase()});
    }
    if (this.showFooter && this.gridTablePagination) {
      Object.assign(queryParams, {size: this.currentPageSize, current: this.currentPage});
    }
    Console.collapse('grid-table.component getData', 'indigoBg', 'queryParams', 'indigoOutline');
    console.log(queryParams);
    console.groupEnd();
    this.api?.showLoadingOverlay();
    this.dataLoading = true;
    if (this.getData) {
      this.getData(queryParams)
        .pipe(takeUntil(this.destroy$), catchError(err => {
          Console.collapse('grid-table.component RefreshRowsData', 'redBg', 'ERROR', 'redOutline');
          console.log(err);
          console.groupEnd();
          return of({total: 0, items: [], statistics: []});
        })).subscribe(response => {
          this.api?.setRowData(response.items);
          this.rowData = response.items;
          this.statistics = response.statistics || [];
          this.total = response.total;
          if (!response.items.length) {
            this.api?.showNoRowsOverlay();
          } else {
            this.api?.hideOverlay();
          }
          this.dataLoading = false;
        });
    }
  }

  /**
   * 重新搜索数据
   */
  searchRowsData(params: {} = {}): void {
    const currentPage = this.currentPage;
    this.currentPage = 1;
    const isNext = this.refreshRowsData(params);
    if (!isNext) {
      this.currentPage = currentPage;
    }
  }

  refreshRowsData(params: {} = {}): boolean {
    if (this.sf) {
      if (this.sf.valid) {
        Object.assign(params, this.sf.value);
      } else {
        return false;
      }
    }
    this.api?.clearRangeSelection();
    this.api?.deselectAll();
    this.next$.next(transformParams(params));
    return true;
  }


  onPageSizeChange(event: any): void {
    this.pageSizeChange.emit(event);
    this.currentPageSize = event;
    this.searchRowsData();
  }

  onPageIndexChange(event: any): void {
    this.pageSizeChange.emit(event);
    this.currentPage = event;
    this.refreshRowsData();
  }


  /**
   * 得到grid中被选择的节点,如果没有返回被范围选中的行,或null
   */
  getSelectOrRangeSelectNode(): Array<RowNode> | null {
    if (this.api) {
      return getSelectOrRangeSelectNode(this.api);
    } else {
      return null;
    }
  }

  /**
   * 客户端模式导出全部数据
   * 分页请求数据，然后前端组装导出
   * @param pageSize 页大小，默认100
   * @param maxRequestCount 并发请求数 默认3
   */
  exportAllPageData(pageSize: number = 100, maxRequestCount: number = 3): void {
    let allData: [] = [];
    this.showProgress = true;
    this.initProgress();
    let currentPage = 1;
    const currentPageSize = pageSize;
    const totalPage = parseInt(this.total / currentPageSize + (this.total % currentPageSize ? 1 : 0) + '', 10);
    if (this.currentPage === currentPage && this.currentPageSize === currentPageSize && this.rowData.length) {
      // @ts-ignore
      allData = allData.concat(this.rowData);
      currentPage = currentPage + 1;
    }
    const sort = this.api?.getSortModel();
    const params = {size: currentPageSize};
    if (sort?.length) {
      Object.assign(params, {sortField: sort[0].colId, sortMethod: (sort[0].sort).toLowerCase()});
    }
    const request$: Array<Observable<{ total: number, items: any[], footerItems?: Array<any> }>> = [];
    for (; currentPage <= totalPage; currentPage++) {
      if (this.getData) {
        request$.push(this.getData({...params, current: currentPage}));
      }
    }

    const _percent = 100 / request$.length;
    // @ts-ignore
    const requestArray$ = arrayPartition(request$, maxRequestCount).map(requests$ => {
      return merge(...requests$);
    });
    Console.color('导出excel', 'indigoBg', `${request$.length}个请求，${requestArray$.length}组`, 'indigoOutline');
    concat(...requestArray$).pipe(tap(next => {
      const percent = parseFloat((this.progressPercent + _percent).toFixed(2));
      if (percent < 100) {
        this.progressPercent = percent;
      }
    })).subscribe(response => {
      // @ts-ignore
      allData = allData.concat(response.items);
    }, (error) => {
      Console.collapse('grid-table.component ExportAllPageData', 'redBg', 'ERROR', 'redOutline');
      console.error(error);
      console.groupEnd();
    }, () => {
      this.api?.setRowData(allData);
      this.progressPercent = 100;
      this.exportDataAsExcel();
      this.showProgress = false;
      this.api?.setRowData(this.rowData);
    });
  }

  exportDataAsExcel(): void {
    const columns = this.columnApi?.getAllDisplayedColumns().filter(column => {
      return !column.getColId().startsWith('_');
    });
    this.api?.exportDataAsExcel({
      columnKeys: columns,
      fileName: this.name ? this.name : 'agent-data',
      sheetName: this.name ? this.name : 'agent-data',
      customFooter: this.exportGridStatisticsFooter(),
    });

  }


  exportGridStatisticsFooter(): ExcelCell[][] {
    const footer = [[]];
    if (this.statistics && this.statistics.length) {
      const statistics = this.statistics.filter(items => items.skipExport !== true)
        .map(items => {
          const rows = [];
          rows.push({
            styleId: 'bigHeader',
            data: {
              type: 'String',
              value: items.label
            }
          });
          items.data.forEach(item => {
            rows.push({
              styleId: 'bigHeader',
              data: {
                type: 'String',
                value: `${item.label}:${item.value}`
              }
            });
          });
          return rows;
        });

      // @ts-ignore
      footer.push(...statistics);
    }
    return footer;

  }

  resetSearch(): void {
    this.sf?.reset();
  }

  /**
   * @deprecated 可以直接使用 searchRowsData()方法
   */
  search(): void {
    this.searchRowsData();
  }

  fullscreenToggle(): void {
    this.fullscreen = !this.fullscreen;
  }


  deleteBatch(node: RowNode[]): Observable<RowNode[] | false> {
    if (!node) {
      // @ts-ignore
      node = this.getSelectOrRangeSelectNode();
    }
    if (!node.length) {
      return of(false);
    }
    this.selectedNodes = node;
    this.initProgress();
    let cancel = false;
    let isStart = false;
    let deleteSuccess: [] = [];
    return this.modal.confirm({
      nzContent: this.deleteContent,
      nzWrapClassName: 'grid-batch-delete',
      nzOnCancel: () => {
        if (isStart && !cancel) {
          cancel = true;
          return false;
        }
        if (deleteSuccess.length) {
          return of(deleteSuccess).toPromise();
        }
        return true;
      },
      nzOnOk: () => {
        this.initProgress();
        const _percent = 100 / node.length;
        /**
         * 删除动作是否已开始
         */
        isStart = false;
        /**
         * 是否属于取消状态(发生删除异常或已启动删除但未完成时单击取消)
         */
        cancel = false;
        /**
         * 已成功删除的行
         */
        deleteSuccess = [];
        const deleteArray = node.map(item => {

          return this.deleteFunc?.(item).pipe(
            // @ts-ignore
            tap(next => deleteSuccess.push(item)), switchMap(result => {
              if (cancel) {
                return throwError(new Error('is cancel'));
              }
              return of(result);
            }),
            tap(next => {
                const percent = parseFloat((this.progressPercent + _percent).toFixed(2));
                if (percent < 100) {
                  this.progressPercent = percent;
                }
              },
              () => {
                cancel = true;
                this.progressStatus = 'exception';
              }));
        });
        // @ts-ignore
        const requestArray$ = arrayPartition(deleteArray, 3).map(requests$ => {
          // @ts-ignore
          return merge(...requests$);
        });
        isStart = true;
        return concat(...requestArray$)
          .pipe(bufferCount(deleteArray.length), tap(next => {
            this.progressPercent = 100;
          }), map(next => node), catchError(err => {
            return of(false);
          })).toPromise();
      }
    }).afterClose;


  }


  /**
   * 初始化进度条
   * 导出|批量删除共用变量
   */
  private initProgress(): void {
    this.progressPercent = 0;
    this.progressStatus = 'normal';

  }


  ngOnDestroy(): void {
    this.next$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
