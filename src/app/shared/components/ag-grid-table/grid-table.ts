import { RowNode } from '@ag-grid-community/core';
import { TemplateRef } from '@angular/core';

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

export interface GridStatistics {
  key: string;
  label: string;
  skipExport?: boolean;
  className?: Array<string> | string;
  data: Array<{ key: string; label: string; value: any; className?: Array<string> | string }>;
}
