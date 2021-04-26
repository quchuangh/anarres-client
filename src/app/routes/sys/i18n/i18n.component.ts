import { GridOptions, GridReadyEvent } from '@ag-grid-community/core';
import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AclColDef, IGridDataSource, NgxGridTableComponent, NgxGridTableConstants } from '@shared';
import { DataSourceUtils } from '../../DataSourceUtils';

@Component({
  selector: 'app-sys-i18n',
  templateUrl: './i18n.component.html',
})
export class SysI18nComponent implements OnInit {
  // properties 的定义为 filter-input.widget.ts -> FilterSFUISchemaItem 接口
  schema: SFSchema = {
    properties: {
      id: { type: 'integer', title: 'id', ui: { options: ['greaterThanOrEqual'], acl: { ability: ['POST:/TEST'] } } },
      i18n: { type: 'string', title: 'i18n', ui: { options: ['startsWith'] } },
      message: { type: 'string', title: 'message', ui: { options: ['startsWith'] } },
      language: { type: 'array', title: '语言', ui: { options: ['in'], selectValues: ['zh_CN', 'en_US', 'zh_TW'] } },
      typeGroup: { type: 'array', title: '类型', ui: { options: ['in'], selectValues: ['服务端', '客户端'] } },
      md5: { type: 'string', title: 'md5', default: 'test' },
      creator: { type: 'string', title: '创建人' },
      createdTime: { type: 'string', title: '创建时间', format: 'date-time' },
      updater: { type: 'string', title: '更新人' },
      updatedTime: { type: 'string', title: '更新时间', format: 'date-time' },
    },
    required: ['text'],
    ui: {
      width: 275,
      spanLabelFixed: 80,
      optionShowType: 'symbol',
      aclTmpl: 'POST:/{}/OUT',
      acl: { ability: ['POST:/TEST0'] },
    },
  };

  columnDefs: AclColDef[] = [
    { headerName: 'id', field: 'id', sort: 'desc', sortable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'i18n', field: 'i18n', acl: { ability: ['POST:/TEST'] } },
    { headerName: 'message', field: 'message', resizable: false },
    { headerName: '语言', field: 'language', enableRowGroup: true, checkboxSelection: true },
    { headerName: '类型', field: 'typeGroup', enableRowGroup: true },
    { headerName: 'md5', field: 'md5' },
    { headerName: '创建人', field: 'creator' },
    { headerName: '创建时间', field: 'createdTime', sortable: true },
    { headerName: '更新人', field: 'updater' },
    { headerName: '更新时间', field: 'updatedTime', sortable: true },
    { headerName: '操作', field: NgxGridTableConstants.OPTION_FIELD },
  ];

  gridOptions: GridOptions;

  dataSource: IGridDataSource;

  @ViewChild(NgxGridTableComponent)
  table!: NgxGridTableComponent;

  constructor(private http: _HttpClient) {
    this.gridOptions = {
      enableCharts: false,
      columnDefs: this.columnDefs,
      getRowNodeId: (data) => {
        return data.id;
      },
      onFirstDataRendered(event: FirstDataRenderedEvent): void {
        event.columnApi.autoSizeAllColumns();
      },
    };
    this.dataSource = DataSourceUtils.create(http, '/api/sys/i18n', (r) => r);
  }

  ngOnInit(): void {}

  // getData(params: any): void {
  //   const current = params.current;
  //   const size = params.size;
  //   delete params.current;
  //   delete params.size;
  //   params = { queries: params, current, size };
  //   return params;
  // }

  onGridReady(e: { event: GridReadyEvent; gridTable: NgxGridTableComponent }): void {
    // Console.collapse($event);
    const records = [];
    for (let i = 0; i < 20; i++) {
      records.push({
        id: 1 + i,
        i18n: 'i18n_' + i,
        message: 'message' + i,
        language: 'language_' + (i % 2),
        typeGroup: 'typeGroup_' + i,
        md5: 'md5_' + i,
        creator: 'creator_' + i,
        createdTime: 'createdTime_' + i,
        updater: 'updater_' + i,
        updatedTime: 'updatedTime_' + i,
      });
    }

    this.table.setData({
      records,
      total: 100,
      size: 20,
      current: 1,
    });

    this.table.addMenu({
      name: 'test',
      show: 'selected',
      acl: { ability: ['POST:/TEST'] },
      callback: (selected) => {
        console.log(selected);
      },
    });
  }

  onPageIndexChange(index: number): void {
    console.log(index);
  }

  test(): void {
    console.log(this.table.api.getPinnedBottomRowCount());
  }

  print(...data: any): void {
    console.log(data);
  }
}
