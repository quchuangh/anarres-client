import { ColumnApi, GetContextMenuItemsParams, GridApi, RowNode } from '@ag-grid-community/core';
import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface IPage<T> {
  /** 数据 */
  records: T[];
  /** 总条数 */
  total: number;
  /** 页大小 */
  size: number;
  /** 当前页码 */
  current: number;
  /** 统计 */
  statistics?: GridStatistics[];
}

export interface GridQuery {
  pageNum?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface PaginationCfg {
  size?: 'default' | 'small' | number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
}
//
export declare type DateOption = 'equals' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual' | 'notEqual' | 'inRange';
export declare type NumberOption = DateOption;
export declare type SetOption = 'in' | 'notIn';
export declare type TextOption = 'equals' | 'notEqual' | 'startsWith' | 'endsWith' | 'contains' | 'notContains';
export declare type FilterType = 'text' | 'set' | 'number' | 'date';

export interface IFilter {
  field: string;
  type: FilterType;

  option: TextOption | SetOption | NumberOption | DateOption;
  value: any;
}

export interface IRangeFilter extends IFilter {
  valueTo?: any;
}

export interface SortModel {
  field: string;
  sort: 'asc' | 'desc';
}

export interface IRowQuery {
  pageNum: number;
  pageSize: number;
  sorts: SortModel[];
  filters: IFilter[];
  fields?: string[];
  treePath: string[];
}

export interface TreeDataCfg {
  isGroup: (item: any) => boolean;
  groupKey: { field: string; type: FilterType };
}

export interface IGridDataSource {
  query: (rowQuery: IRowQuery) => Observable<IPage<any>>;
  modify?: (data: any) => Observable<any>;
  delete?: (id: any) => Observable<any>;
  create?: (data: any) => Observable<any>;
  map: (data: any) => any;
}

export interface MenuItem {
  name: string;
  acl?: string;
  icon?: HTMLElement | string;
  callback: (selected: any, params: GetContextMenuItemsParams, api: GridApi) => void;
  show: ((selected: any[], params: GetContextMenuItemsParams, api: GridApi) => boolean) | 'selected';
}

export interface GridStatistics {
  func: string;
  label: string;
  skipExport?: boolean;
  className?: Array<string> | string;
  fields: Array<{ field: string; label: string; value: any; className?: Array<string> | string }>;
}

export interface ApiGetter {
  get: () => { columnApi: ColumnApi; api: GridApi };
}
