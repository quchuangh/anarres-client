import {
  AgEvent,
  ColDef,
  ColumnApi,
  Constants,
  GetContextMenuItemsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideGetRowsParams,
  MenuItemDef,
} from '@ag-grid-community/core';
import { ColGroupDef } from '@ag-grid-community/core/dist/cjs/entities/colDef';
import { GetContextMenuItems } from '@ag-grid-community/core/dist/cjs/entities/gridOptions';
import { TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil, takeWhile } from 'rxjs/operators';
import { IFilter } from '../filter-input/filter.types';
import { TemplateRendererComponent } from './inner-tags/template-renderer.component';
import { GRID_LOCALE_TEXT } from './localeText';
import { NgxGridTableConstants } from './ngx-grid-table-constants';
import { AclColDef, ApiGetter, IRowQuery, MenuItem, TreeDataCfg } from './ngx-grid-table-model';
import { deepEach, isGroup } from './ngx-grid-table-utils';

export function buildFrameworkComponents(gridOptions: GridOptions): void {
  if (gridOptions.frameworkComponents) {
    gridOptions.frameworkComponents = {
      ...NgxGridTableConstants.DEFAULT_FRAMEWORK_COMPONENTS,
      ...gridOptions.frameworkComponents,
    };
  } else {
    gridOptions.frameworkComponents = NgxGridTableConstants.DEFAULT_FRAMEWORK_COMPONENTS;
  }
}

export function buildTreeDataCfg(gridOptions: GridOptions, treeData: false | TreeDataCfg): void {
  if (treeData) {
    treeData.groupKey = treeData.groupKey ? treeData.groupKey : { field: 'id', type: 'number' };
    gridOptions.treeData = true;
    gridOptions.isServerSideGroup = treeData.isGroup;
    gridOptions.getServerSideGroupKey = (dataItem) => {
      return dataItem[treeData.groupKey!.field];
    };
  } else {
    gridOptions.treeData = false;
  }
}

export function buildStatusBar(gridOptions: GridOptions, defaultStatusBar: boolean): void {
  const statusPanels = [];
  if (defaultStatusBar) {
    statusPanels.push(...NgxGridTableConstants.DEFAULT_STATUS_BAR);
  }
  if (gridOptions.statusBar && gridOptions.statusBar.statusPanels.length) {
    gridOptions.statusBar.statusPanels.push(...statusPanels);
  } else {
    gridOptions.statusBar = { statusPanels };
  }
}

export function buildMenus(
  gridOptions: GridOptions,
  translateService: TranslateService,
  acl: ACLService,
  additionMenu: Array<MenuItem>,
  // deleteMenu: boolean,
  destroy$: Subject<any>,
  apiGetter: ApiGetter,
  selectDataGetter: () => any[],
  // doDeleted: () => void,
): void {
  let _getContextMenuItems: GetContextMenuItems;
  if (gridOptions.getContextMenuItems) {
    _getContextMenuItems = gridOptions.getContextMenuItems;
    delete gridOptions.getContextMenuItems;
  }

  let contextMenuItemsLabel = {
    'grid.table.columns.autosize': 'grid.table.columns.autosize',
    'grid.table.columns.fit': 'grid.table.columns.fit',
  };

  additionMenu.forEach((value) => {
    if (value.name) {
      // @ts-ignore
      contextMenuItemsLabel[value.name] = value.name;
    }
  });

  translateService
    .get(['grid.table.columns.autosize', 'grid.table.columns.fit'])
    .pipe(takeUntil(destroy$))
    .subscribe((label) => {
      contextMenuItemsLabel = label;
    });

  gridOptions.getContextMenuItems = (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
    const apis = apiGetter.get();
    const selectedData = selectDataGetter();
    const fixed = [
      {
        icon: '<i class="mdi ag-icon mdi-border-inside"></i>',
        name: contextMenuItemsLabel['grid.table.columns.autosize'],
        action: () => {
          apis.columnApi.autoSizeAllColumns();
        },
      },
      {
        icon: '<i class="mdi ag-icon mdi-fit-to-page-outline"></i>',
        name: contextMenuItemsLabel['grid.table.columns.fit'],
        action: () => {
          apis.api.sizeColumnsToFit();
        },
      },
      'copy',
    ] as (string | MenuItemDef)[];

    if (gridOptions.enableCharts) {
      fixed.push('chartRange');
    }

    // if (deleteMenu && selectedData.length) {
    //   fixed.splice(
    //     0,
    //     0,
    //     {
    //       name: '????????????',
    //       tooltip: '?????????????????????',
    //       disabled: !(params.node && params.node.data),
    //       icon: `<i class="mdi ag-icon mdi-delete-sweep"></i>`,
    //       action: () => doDeleted(),
    //     } as MenuItemDef,
    //     'separator',
    //   );
    // }
    // ??????????????????
    const menus: MenuItemDef[] = additionMenu
      .filter((value) => {
        if (!value.acl) {
          return true;
        }
        return acl.can(value.acl);
      })
      .map((value) => {
        let disabled = false;
        if (value.show) {
          disabled = !(value.show === 'selected' ? params.node && params.node.data : value.show(selectedData, params, apis.api));
        }
        return {
          ...value,
          action: () => {
            value.callback(params.node.data, params, apis.api);
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
         * ?????????????????????????????????????????????????????????menu,??????????????????
         * ?????????????????????????????????separator
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
 * ?????? rowModelType, ????????????????????????, ?????????????????????debug?????????????????????
 * tableModel ??? pageable ??????rowModelType ???????????? ???clientSide???
 * tableModel ??? infinite ??????rowModelType ???????????? ???serverSide???
 */
export function repairRowModeType(gridOptions: GridOptions, dataLoadModel: 'pageable' | 'infinite'): void {
  const rowModelType = gridOptions.rowModelType;
  if (rowModelType) {
    console.warn(`
        GridTable ???????????????????????????????????????????????????????????????rowModelType??? serverSide ?????? clientSide. ??????????????????????????????
        ??????viewport?????????????????????????????????, ??????????????????AgGrid?????? rowModelType ??????. ?????????????????????????????????????????? ??????????????????????????? ???????????????
        ?????????????????? tableModel ?????????????????????????????????????????????????????? showPageBar ?????????false
      `);
  }
  if (dataLoadModel === 'pageable') {
    gridOptions.rowModelType = Constants.ROW_MODEL_TYPE_CLIENT_SIDE;
  } else {
    gridOptions.rowModelType = Constants.ROW_MODEL_TYPE_SERVER_SIDE;
  }
}

export function buildColACL(gridOptions: GridOptions, acl: ACLService, colACLTmpl?: string): void {
  if (gridOptions.columnDefs) {
    deepEach(gridOptions.columnDefs, (col) => {
      const aclCol = col as AclColDef;
      if (!aclCol.acl && colACLTmpl && colACLTmpl.length && aclCol.field) {
        aclCol.acl = colACLTmpl.replace('{}', aclCol.field);
      }
    });
    checkACL(gridOptions.columnDefs, acl);
  }
}

function checkACL(columnDefs: (ColDef | ColGroupDef)[], acl: ACLService): void {
  for (let i = 0; i < columnDefs.length; ) {
    const value = columnDefs[i];
    if (isGroup(value)) {
      checkACL((value as ColGroupDef).children, acl);
    } else {
      const aclCol = value as AclColDef;
      if (aclCol.acl && !acl.can(aclCol.acl)) {
        columnDefs.splice(i, 1);
        continue;
      }
    }
    i++;
  }
}

export function buildSideBar(gridOptions: GridOptions): void {
  const sideBar = JSON.parse(JSON.stringify(NgxGridTableConstants.DEFAULT_SIDE_BAR));
  if (gridOptions.sideBar) {
    if (gridOptions.sideBar === 'default') {
      gridOptions.sideBar = sideBar;
    } else if (typeof gridOptions.sideBar === 'string') {
      // todo ??????
    } else if (typeof gridOptions.sideBar === 'boolean') {
      // todo ??????
    } else {
      let toolPanels = sideBar.toolPanels;
      toolPanels = toolPanels.concat(gridOptions.sideBar.toolPanels || []);
      gridOptions.sideBar = { ...NgxGridTableConstants.DEFAULT_SIDE_BAR, ...gridOptions.sideBar, toolPanels };
      gridOptions.sideBar.hiddenByDefault = true;
    }
  }
}

export function buildOptionField(gridOptions: GridOptions, template: TemplateRef<any>): void {
  let optionCell!: ColDef;

  deepEach(gridOptions.columnDefs ? gridOptions.columnDefs : [], (col) => {
    if (col.field === NgxGridTableConstants.OPTION_FIELD) {
      optionCell = col;
    }
  });
  if (optionCell && !template) {
    console.warn(`????????????${NgxGridTableConstants.OPTION_FIELD}??????????????????????????????????????????????????????????????????????????????
        <ng-template #optionCell>
            <button>...</button>
        </ng-template>
        <ngx-grid-table [optionCell]="optionCell"></ngx-grid-table>`);
    return;
  }
  if (!optionCell && template) {
    console.warn(`????????????optionCell??????????????????????????????????????????????????????????????????????????????
      columnDefs: ColDef[] = [
        { headerName: 'id', field: 'id', sort: 'desc', sortable: true, checkboxSelection: true, headerCheckboxSelection: true },
        ...
        { headerName: '??????', field: NgxGridTableConstants.OPTION_FIELD },
      ];
    `);
    return;
  }
  if (optionCell) {
    optionCell.chartDataType = 'excluded';
    optionCell.cellRendererFramework = TemplateRendererComponent;
    optionCell.cellRendererParams = { ngTemplate: template };
    optionCell.sortable = false;
    optionCell.suppressSizeToFit = true;
  }
}

export function buildResizable(gridOptions: GridOptions, resizable: boolean): void {
  if (!gridOptions.columnDefs) {
    return;
  }
  deepEach(gridOptions.columnDefs, (col) => {
    if (typeof col.resizable === 'undefined') {
      col.resizable = resizable;
    }
  });
}

export function reuseTabFix(router: Router, currentUrl: string, destroy$: Subject<any>, apiGetter: ApiGetter): void {
  const fix: any = {};
  /** ??????3??????????????????reuseTabFix */
  fix.dispatchFirstDataRendered = false;
  fix.firstLeavePageTime = undefined;
  fix.firstDataRenderedTime = undefined;

  router.events
    .pipe(
      filter((evt) => evt instanceof NavigationEnd),
      takeUntil(destroy$),
      takeWhile(() => !fix.dispatchFirstDataRendered),
    )
    .subscribe(() => {
      const isCurrentPage = currentUrl === router.url;
      if (!fix.firstLeavePageTime && !isCurrentPage) {
        fix.firstLeavePageTime = new Date().getTime();
      }
      if (isCurrentPage && fix.firstLeavePageTime && fix.firstDataRenderedTime) {
        if (fix.firstLeavePageTime - fix.firstDataRenderedTime < 800) {
          const apis = apiGetter.get();
          apis.api.dispatchEvent({
            type: 'firstDataRendered',
            api: apis.api,
            columnApi: apis.columnApi,
          } as AgEvent);
          fix.dispatchFirstDataRendered = true;
        } else {
          fix.dispatchFirstDataRendered = true;
        }
      }
    });
}

/**
 * ?????? GridOptions
 */
export function initGridOptions(gridOptions: GridOptions, rowSelection: string, onReady: (event: GridReadyEvent) => void): GridOptions {
  const tmpOnReady = gridOptions.onGridReady;

  return {
    enableCellChangeFlash: true,
    getRowNodeId: (data) => data.id,
    animateRows: true,
    rowSelection,
    localeText: GRID_LOCALE_TEXT, // ???????????????
    enableRangeSelection: true,
    loadingOverlayComponent: 'loadingOverlay',
    noRowsOverlayComponent: 'noRowsOverlay',
    pagination: false,
    suppressPaginationPanel: true,
    onGridReady: (event: GridReadyEvent) => {
      onReady(event);
      if (tmpOnReady) {
        tmpOnReady(event);
      }
    },
    ...gridOptions,
  };
}

export function clientSideAsRowQuery(
  api: GridApi,
  columnApi: ColumnApi,
  pageNum: number,
  pageSize: number,
  extFilter: IFilter[],
): IRowQuery {
  const sortModel = columnApi
    .getColumnState()
    .filter((value) => value.sort && value.sortIndex)
    .sort((a, b) => {
      // @ts-ignore
      return a.sortIndex - b.sortIndex;
    })
    .map((value) => ({
      colId: value.colId,
      sort: value.sort,
    }));
  // @ts-ignore
  return asRowQuery(api.getFilterModel(), sortModel, pageNum, pageSize, extFilter);
}

export function serverSideAsRowQuery(
  tableParams: IServerSideGetRowsParams,
  treeData: false | TreeDataCfg,
  extFilter: IFilter[],
): IRowQuery {
  // ??????
  const startRow = tableParams.request.startRow;
  const endRow = tableParams.request.endRow;
  const pageSize = endRow - startRow;
  const page = startRow / pageSize + 1;

  const rowQuery = asRowQuery(tableParams.request.filterModel, tableParams.request.sortModel, page, pageSize, extFilter);
  // treeData
  if (treeData) {
    const groupKeys = tableParams.request.groupKeys;
    if (groupKeys.length) {
      rowQuery.treePath = groupKeys;
    }
  }
  return rowQuery;
}

function asRowQuery(
  filterModel: any,
  sorts: { colId: string; sort: string }[],
  pageNum: number,
  pageSize: number,
  extFilter?: IFilter[],
): IRowQuery {
  const rowQuery = {} as IRowQuery;
  // ??????
  rowQuery.pageNum = pageNum;
  rowQuery.pageSize = pageSize;

  // ??????
  if (sorts.length) {
    rowQuery.sorts = sorts.map((sort: any) => {
      return {
        sort: sort.sort,
        field: sort.colId,
      };
    });
  }

  // ??????
  rowQuery.filters = Object.keys(filterModel).map((key) => {
    const f = filterModel[key];
    const r = {
      field: key,
      filterType: f.filterType,
      option: f.type,
      value: f.filter || f.dateFrom || f.values,
      valueTo: f.filterTo || f.dateTo,
    };
    if (!r.valueTo) {
      delete r.valueTo;
    }
    return r;
  });

  if (extFilter) {
    extFilter.forEach((value) => {
      rowQuery.filters.push(value);
    });
  }
  return rowQuery;
}
