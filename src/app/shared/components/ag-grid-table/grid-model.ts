import { GetContextMenuItemsParams, GridApi, RowNode } from '@ag-grid-community/core';
import { TemplateRef } from '@angular/core';

export interface IPage<T> {
  /** 数据 */
  records: T[];
  /** 总条数 */
  total: number;
  /** 页大小 */
  size: number;
  /** 当前页码 */
  current: number;
}

export interface PaginationCfg {
  size?: 'default' | 'small' | number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
  show?: 'bottom' | 'top' | 'both';
}

export interface IGridDataSource {
  type: 'local' | 'server';
}

export interface CellOption {
  headerName: string;
  action: Array<CellActionOption>;
  content?: TemplateRef<{}>;
  first?: boolean;
}

export interface CellActionOption {
  name: string;
  click?: (node: RowNode) => void;
  iconType?: string;
  iconClass?: Array<string> | string;
  acl?: string;
  style?: { [key: string]: any };
  className?: Array<string> | string;
  type?: 'primary' | 'dashed' | 'danger' | 'link' | 'default';
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

export class LocalDataSource implements IGridDataSource {
  type: 'local' | 'server' = 'local';
}

export class ServerDataSource implements IGridDataSource {
  type: 'local' | 'server' = 'server';
}
