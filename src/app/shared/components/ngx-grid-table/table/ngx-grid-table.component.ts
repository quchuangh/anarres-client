import { ColumnApi, GridApi, GridOptions, GridReadyEvent, IServerSideGetRowsParams, RowNode } from '@ag-grid-community/core';
import { CellRange } from '@ag-grid-community/core/dist/cjs/interfaces/iRangeController';
import { IServerSideDatasource } from '@ag-grid-community/core/dist/cjs/interfaces/iServerSideDatasource';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService } from '@delon/acl';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Console } from '../../../utils/console';
import { IFilter } from '../../filter-input/filter.types';
// 不要使用import {Console} from '@shared'，防止循环引用
import {
  buildColACL,
  buildFrameworkComponents,
  buildMenus,
  buildOptionField,
  buildResizable,
  buildSideBar,
  buildStatusBar,
  buildTreeDataCfg,
  clientSideAsRowQuery,
  initGridOptions,
  repairRowModeType,
  reuseTabFix,
  serverSideAsRowQuery,
} from '../ngx-grid-functions';
import { NgxGridTableConstants } from '../ngx-grid-table-constants';
import {
  ApiGetter,
  GridStatistics,
  IGridDataSource,
  IPage,
  IRowQuery,
  MenuItem,
  PaginationCfg,
  TreeDataCfg,
} from '../ngx-grid-table-model';
import { asRowQueryPropertiesUI } from '../ngx-grid-table-utils';
import { SfQueryFormComponent } from '../sf-query-form/sf-query-form.component';

/**
 * 表格提供 分页 和 无限 两种模式。
 * 分页：使用client-side模式来处理。
 * 无限：使用server-side模式来处理。
 *
 */
@Component({
  selector: 'ngx-grid-table',
  templateUrl: './ngx-grid-table.component.html',
  styleUrls: ['./ngx-grid-table.component.scss'],
})
export class NgxGridTableComponent implements OnInit, OnDestroy {
  // =============================== 表格内部参数 =========================
  __show__ = true;
  /** 添加菜单 */
  private additionMenu: Array<MenuItem> = [];
  /** 销毁 */
  private destroy$ = new Subject();
  /** 是否为树状数据 */
  private treeData: false | TreeDataCfg = false;

  allModules = AllModules;

  /** 表格初始化后的 api 对象，同于控制表格行为 */
  api!: GridApi;
  /** 表格初始化后的 ColumnApi对象，用于控制表列行为 */
  columnApi!: ColumnApi;

  /** 是否正在加载数据中 */
  dataLoading = false;
  /** 加载进度条 */
  loadProgressPercent = 0;
  /** 统计数据 */
  statistics!: Array<GridStatistics>;
  /** 当前页对象 */
  cur_page!: IPage<any>;
  /** 表格页面所在的url */
  currentUrl: string;

  _searchSchema!: SFSchema;

  // ================================== 基本配置（外部） =============================
  /** 是否为全屏状态 */
  @Input() fullscreen = false;
  /** 当前页码 */
  @Input() pageIndex = 1;
  /** 页大小 */
  @Input() pageSize = 20;
  /** 表格基础配置 */
  @Input() gridOptions!: GridOptions;
  /** 表格基础配置 */
  @Input() colACLTmpl!: string;
  /** 表格主题 */
  @Input() gridTheme = 'ag-theme-balham';
  /** 表格CSS */
  @Input() gridTableClass = [];
  /** 数据表格样式 */
  @Input() gridTableStyle: { [key: string]: any } = { width: '100%', height: '70%' };
  /** 是否在表格初始化后立即执行一次查询 */
  @Input() initLoadData = true;
  /** 分页还是无限 */
  @Input() dataLoadModel: 'pageable' | 'infinite' = 'pageable';
  /** 是否显示分页控件 */
  @Input() showPagination: false | PaginationCfg = {};
  /** 是否显示默认状态栏, 展示用户选中项状态数据 */
  @Input() defaultStatusBar = false;
  /** 单行还是多行 */
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  /** 是否显示统计 */
  @Input() showStatistics = false;
  /** 是否展示删除菜单 */
  @Input() deleteMenu = true;
  /** 默认是否可以改变列宽 */
  @Input() resizable = false;
  /** 分组时checkbox是否影响自己的子项 */
  @Input() groupSelectsChildren = true;
  /** 操作列模板 */
  @Input() optionCell!: TemplateRef<any>;
  /** 数据源 */
  @Input() dataSource!: IGridDataSource;
  /** 表单schema */
  @Input() set searchSchema(schema: SFSchema) {
    this._searchSchema = asRowQueryPropertiesUI(schema);
  }
  /** 初始表单数据 */
  @Input() initFormData!: any;

  @Input() customPageView!: TemplateRef<any>;

  @Input() filterHand!: (filters: IFilter[]) => IFilter[];

  // ============================== 事件 ============================
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  /** 表格就绪事件 */
  @Output() gridReady = new EventEmitter<{ event: GridReadyEvent; gridTable: NgxGridTableComponent }>();
  /** 删除事件 */
  @Output() deleted = new EventEmitter<any>();
  @Output() dataLoadingChange = new EventEmitter<boolean>();
  @Output() dataLoadModelChange = new EventEmitter<'pageable' | 'infinite'>();

  // ============================= 组件 =======================
  @ViewChild(SfQueryFormComponent) form!: SfQueryFormComponent;
  @ViewChild('defaultPageTmpl') defaultPageTmpl!: TemplateRef<any>;

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
    // api 获取方法，用于给functions传递api对象
    const apiGetter: ApiGetter = { get: () => ({ api: this.api, columnApi: this.columnApi }) };

    buildFrameworkComponents(this.gridOptions);
    // 构建菜单
    buildMenus(
      this.gridOptions,
      this.translateService,
      this.aclService,
      this.additionMenu,
      this.deleteMenu,
      this.destroy$,
      apiGetter,
      () => this.getSelectionData(),
      () => this.doDelete(),
    );
    buildTreeDataCfg(this.gridOptions, this.treeData);
    buildStatusBar(this.gridOptions, this.defaultStatusBar);
    buildSideBar(this.gridOptions);
    buildResizable(this.gridOptions, this.resizable);
    buildOptionField(this.gridOptions, this.optionCell);
    reuseTabFix(this.router, this.currentUrl, this.destroy$, apiGetter);
    repairRowModeType(this.gridOptions, this.dataLoadModel);
    buildColACL(this.gridOptions, this.aclService, this.colACLTmpl);

    this.showPagination = {
      ...NgxGridTableConstants.DEFAULT_PAGINATION,
      ...this.showPagination,
    };

    this.gridOptions = initGridOptions(this.gridOptions, this.rowSelection, (event) => this.onGridReady(event));
  }

  private onGridReady(event: GridReadyEvent): void {
    this.api = event.api;
    this.columnApi = event.columnApi;

    if (this.dataLoadModel === 'infinite') {
      this.api.setServerSideDatasource(this.infiniteDataSource());
    }

    this.gridReady.emit({ event, gridTable: this });

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

  private filters(): IFilter[] {
    let filters = [] as IFilter[];
    if (this.form) {
      filters = [...this.form.filter];
    }
    if (this.filterHand) {
      filters = [...this.filterHand(filters)];
    }
    return filters;
  }

  private infiniteDataSource(): IServerSideDatasource {
    const getRows = (params: IServerSideGetRowsParams) => {
      const rowQuery = serverSideAsRowQuery(params, this.treeData, this.filters());
      Console.collapse('grid-table.component getData', 'indigoBg', 'queryParams', 'indigoOutline');
      console.log(rowQuery);
      console.groupEnd();
      this.setDataLoading(true);
      this.api.showLoadingOverlay();
      this.dataSource
        .query(rowQuery)
        .pipe(
          takeUntil(this.destroy$),
          catchError((err) => {
            Console.collapse('grid-table.component RefreshRowsData', 'redBg', 'ERROR', 'redOutline');
            console.error(err);
            console.groupEnd();
            return of({} as IPage<any>);
          }),
        )
        .subscribe((resultPage) => {
          if (resultPage.records) {
            params.successCallback(resultPage.records, resultPage.total);
            this.statistics = resultPage.statistics || [];
            this.api.hideOverlay();
          } else {
            this.api.showNoRowsOverlay();
            params.failCallback();
          }
          this.setDataLoading(false);
        });
    };
    return { getRows };
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

  /**
   * 查询
   */
  query(pageNum: number, pageSize: number): void {
    this.api.clearRangeSelection();
    this.api.deselectAll();
    if (this.dataLoadModel !== 'pageable') {
      console.warn('pageable 模式才能进行分页查询');
      return;
    }

    const rowQuery: IRowQuery = clientSideAsRowQuery(this.api, pageNum, pageSize, this.filters());
    Console.collapse('grid-table.component getData', 'indigoBg', 'queryParams', 'indigoOutline');
    console.log(rowQuery);
    console.groupEnd();
    this.api.showLoadingOverlay();
    this.setDataLoading(true);

    this.dataSource
      .query(rowQuery)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          Console.collapse('grid-table.component RefreshRowsData', 'redBg', 'ERROR', 'redOutline');
          console.log(err);
          console.groupEnd();
          return of({ total: 0, records: [], size: rowQuery.pageSize, current: rowQuery.pageNum, statistics: [] } as IPage<any>);
        }),
      )
      .subscribe((resultPage) => {
        this.cur_page = resultPage;
        this.api.setRowData(resultPage.records);
        this.statistics = resultPage.statistics || [];
        if (!resultPage.records.length) {
          this.api.showNoRowsOverlay();
        } else {
          this.api.hideOverlay();
        }
        this.setDataLoading(false);
      });
  }

  onPageSizeChange(size: number): void {
    this.setPageSize(size, true);
    this.query(1, size);
  }

  onPageIndexChange(idx: number): void {
    this.setPageIndex(idx, true);
    this.query(idx, this.pageSize);
  }

  exportAllPageData(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setData(data: IPage<any>): void {
    if (this.dataLoadModel === 'pageable') {
      this.cur_page = data;
      this.setPageIndex(this.cur_page.current, false);
      this.setPageSize(this.cur_page.size, false);
      this.api.setRowData(this.cur_page.records);
    } else {
      console.warn('只有 tableModel === ‘pageable’ 才允许直接存值');
    }
  }

  // 添加菜单
  public addMenu(item: MenuItem): void {
    this.additionMenu.push(item);
  }

  /**
   * 刷新表格
   */
  public refresh(): void {
    if (this.dataLoadModel === 'pageable') {
      this.query(this.pageIndex, this.pageSize);
    } else {
      this.api.purgeServerSideCache();
    }
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

  /**
   * 重置表单
   */
  resetForm(): void {
    this.form.reset();
  }

  get pageViewTmpl(): TemplateRef<any> {
    return this.customPageView ? this.customPageView : this.defaultPageTmpl;
  }

  // ================================== 数据绑定 ====================================
  toggleFullscreen(): void {
    this.setFullscreen(!this.fullscreen);
  }
  setFullscreen(fullscreen: boolean): void {
    this.fullscreen = fullscreen;
    this.fullscreenChange.emit(this.fullscreen);
  }

  setPageIndex(pageIndex: number, emit: boolean): void {
    this.pageIndex = pageIndex;
    if (emit) {
      this.pageIndexChange.emit(pageIndex);
    }
  }

  setPageSize(pageSize: number, emit: boolean): void {
    this.pageSize = pageSize;
    if (emit) {
      this.pageSizeChange.emit(pageSize);
    }
  }

  private setDataLoading(loading: boolean): void {
    this.dataLoading = loading;
    this.dataLoadingChange.emit(this.dataLoading);
  }

  toggleDataModel(): void {
    if ('pageable' === this.dataLoadModel) {
      this.setDataMode('infinite');
    } else {
      this.setDataMode('pageable');
    }
  }

  setDataMode(model: 'pageable' | 'infinite'): void {
    this.dataLoadModel = model;
    repairRowModeType(this.gridOptions, this.dataLoadModel);
    // TODO 刷新表格
    this.repaint();
    this.dataLoadModelChange.emit(this.dataLoadModel);
  }

  repaint(): void {
    this.__show__ = false;
    setTimeout(() => (this.__show__ = true), 200);
  }
}
