import { PaginationCfg } from '@shared';
import { LoadingOverlayComponent } from './inner-tags/loading-overlay/loading-overlay.component';
import { NoRowOverlayComponent } from './inner-tags/no-row-overlay.component';

export class NgxGridTableConstants {
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
    loadingOverlay: LoadingOverlayComponent,
    noRowsOverlay: NoRowOverlayComponent,
  };
  static DEFAULT_STATUS_BAR = [
    { statusPanel: 'agFilteredRowCountComponent' },
    { statusPanel: 'agSelectedRowCountComponent' },
    { statusPanel: 'agAggregationComponent' },
  ];

  static DEFAULT_PAGINATION: PaginationCfg = {
    pageSizeOptions: [20, 50, 100, 300, 500, 900],
    size: 'small',
    showSizeChanger: true,
    showQuickJumper: true,
  };
  static OPTION_FIELD = '__OPTION__';
}
