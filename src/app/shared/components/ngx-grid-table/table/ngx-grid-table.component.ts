import { ColumnApi, GridApi, GridOptions, GridReadyEvent, IServerSideGetRowsParams, RowNode } from '@ag-grid-community/core';
import { CellRange } from '@ag-grid-community/core/dist/cjs/interfaces/iRangeController';

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
import { buildTreeData, Console, GridQuery, IRowQuery, TreeDataCfg } from '../../..';
import { QueryFormComponent } from '../inner-tags/query-form/query-form.component';
// 不要使用import {Console} from '@shared'，防止循环引用
import {
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
import { ApiGetter, GridStatistics, IGridDataSource, IPage, MenuItem, PaginationCfg } from '../ngx-grid-table-model';

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
  /** 添加菜单 */
  private additionMenu: Array<MenuItem> = [];
  /** 销毁 */
  private destroy$ = new Subject();
  /** 是否为树状数据 */
  private treeData: false | TreeDataCfg = false;

  allModules = AllModules;
  /** 是否为全屏状态 */
  fullscreen = false;
  /** 表格初始化后的 api 对象，同于控制表格行为 */
  api!: GridApi;
  /** 表格初始化后的 ColumnApi对象，用于控制表列行为 */
  columnApi!: ColumnApi;
  /** 当前页码 */
  pageIdx = 1;
  /** 页大小 */
  pageSize = 20;
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
  /** 异步查询对象 */
  next$ = new Subject<GridQuery>();

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
  @Input() dataLoadModel: 'pageable' | 'infinite' = 'pageable';
  /** 页码和页大小变更时是否自动查询 */
  @Input() autoQueryOnPageChange = true;
  /** 是否显示分页控件 */
  @Input() showPagination: false | PaginationCfg = {};
  /** 是否显示默认状态栏, 展示用户选中项状态数据 */
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
  /** 操作列模板 */
  @Input() optionCell!: TemplateRef<any>;
  /** 数据源 */
  @Input() dataSource!: IGridDataSource;
  /** 表单schema */
  @Input() searchSchema!: SFSchema;
  /** 默认表单数据 */
  @Input() searchData!: any;

  // ============================== 事件 ============================
  /** 表格就绪事件 */
  @Output() gridReady = new EventEmitter<{ event: GridReadyEvent; gridTable: NgxGridTableComponent }>();
  /** 页码变更事件 */
  @Output() pageIndexChange = new EventEmitter<number>();
  /** 页大小变更事件 */
  @Output() pageSizeChange = new EventEmitter<number>();
  /** 删除事件 */
  @Output() deleted = new EventEmitter<any>();

  // ============================= 组件 =======================
  @ViewChild(QueryFormComponent) form!: QueryFormComponent;

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
    this.nextDataSubscribe();
    buildFrameworkComponents(this.gridOptions);
    // 构建菜单
    buildMenus(
      this.gridOptions,
      this.translateService,
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
    // TODO 构建ACL

    if (this.dataLoadModel !== 'pageable') {
      this.showPagination = false;
    }

    this.showPagination = {
      ...NgxGridTableConstants.DEFAULT_PAGINATION,
      ...this.showPagination,
    };

    this.gridOptions = initGridOptions(this.gridOptions, this.rowSelection, (event) => this.onGridReady(event));
  }

  private onGridReady(event: GridReadyEvent): void {
    this.api = event.api;
    this.columnApi = event.columnApi;

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

  private nextDataSubscribe(): void {
    this.next$.subscribe((query: GridQuery) => {
      if (this.dataLoadModel === 'pageable') {
        this.pageSource(query);
      } else {
        this.infiniteSource(query);
      }
    });
  }

  private pageSource(gridQuery: GridQuery): void {
    if (!gridQuery.pageNum || !gridQuery.pageSize) {
      console.error(`GridQuery进行分页查询时，居然没有传入 pageNum 和 pageSize 参数，请联系开发者对其进行修复`);
      gridQuery.pageNum = this.cur_page.current;
      gridQuery.pageSize = this.cur_page.size;
    }
    const rowQuery: IRowQuery = clientSideAsRowQuery(this.api, gridQuery);

    Console.collapse('grid-table.component getData', 'indigoBg', 'queryParams', 'indigoOutline');
    console.log(rowQuery);
    console.groupEnd();
    this.api.showLoadingOverlay();
    this.dataLoading = true;

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
        this.dataLoading = false;
      });
  }

  private infiniteSource(gridQuery: GridQuery): void {
    this.api.showLoadingOverlay();

    this.api.setServerSideDatasource({
      getRows: (tableParams: IServerSideGetRowsParams) => {
        const rowQuery = serverSideAsRowQuery(tableParams, gridQuery, this.treeData);

        Console.collapse('grid-table.component getData', 'indigoBg', 'queryParams', 'indigoOutline');
        console.log(rowQuery);
        console.groupEnd();
        this.dataLoading = true;
        this.api.showLoadingOverlay();
        this.dataSource
          .query(rowQuery)
          .pipe(
            takeUntil(this.destroy$),
            catchError((err) => {
              Console.collapse('grid-table.component RefreshRowsData', 'redBg', 'ERROR', 'redOutline');
              console.error(err);
              console.groupEnd();
              return of({ total: 0, records: [], size: rowQuery.pageSize, current: rowQuery.pageNum, statistics: [] } as IPage<any>);
            }),
          )
          .subscribe((resultPage) => {
            this.cur_page = resultPage;
            tableParams.successCallback(resultPage.records, resultPage.total);
            this.statistics = resultPage.statistics || [];
            if (!resultPage.records.length && !this.treeData) {
              this.api.showNoRowsOverlay();
            } else {
              this.api.hideOverlay();
            }
            this.dataLoading = false;
          });
      },
    });
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
    this.next$.next({ pageNum, pageSize, ...this.form.filter });
  }

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
    if (this.dataLoadModel === 'pageable') {
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
}
