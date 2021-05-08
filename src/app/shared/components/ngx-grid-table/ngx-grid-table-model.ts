import { ColDef, ColumnApi, GetContextMenuItemsParams, GridApi } from '@ag-grid-community/core';
import { ACLCanType, ACLType } from '@delon/acl';
import { Observable } from 'rxjs';
import { FilterType, IFilter } from '../filter-input/filter.types';

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

export interface PaginationCfg {
  size?: 'default' | 'small' | number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
}
//

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

export interface AclColDef extends ColDef {
  acl?: ACLCanType;
}

// export interface IGridDataSource {
//   query: (rowQuery: IRowQuery) => Observable<IPage<any>>;
//   modify?: (data: any) => Observable<any>;
//   delete?: (id: any) => Observable<any>;
//   create?: (data: any) => Observable<any>;
//   map: (data: any) => any;
// }

export type IGridDataSource<T> = <T>(rowQuery: IRowQuery) => Observable<IPage<T>>;

export interface MenuItem {
  name: string;
  acl?: ACLType;
  icon?: HTMLElement | string;
  callback: (selected: any, params: GetContextMenuItemsParams, api: GridApi) => void;
  show?: ((selected: any[], params: GetContextMenuItemsParams, api: GridApi) => boolean) | 'selected';
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
