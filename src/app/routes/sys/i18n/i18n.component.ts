import { ColDef, GridOptions, GridReadyEvent } from '@ag-grid-community/core';
import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AgGridTableComponent } from '@shared';

@Component({
  selector: 'app-sys-i18n',
  templateUrl: './i18n.component.html',
})
export class SysI18nComponent implements OnInit {
  schema: SFSchema = {
    properties: {
      i18n: { type: 'string', title: 'i18n', minLength: 1 },
      message: { type: 'string', title: 'message', minLength: 1 },
      language: { type: 'string', title: '语言', minLength: 1 },
      typeGroup: {
        type: 'string',
        title: '类型',
        enum: [
          { label: '服务端', value: 'SERVER' },
          { label: '客户端', value: 'CLIENT' },
        ],
      },
      md5: { type: 'string', title: 'md5', default: '' },
      creator: { type: 'string', title: '创建人' },
      createdTime: { type: 'string', title: '创建时间', format: 'date-time' },
      updater: { type: 'string', title: '更新人' },
      updatedTime: { type: 'string', title: '更新时间' },
    },
    required: ['text'],
    ui: { grid: { md: 24, lg: 12 }, spanLabelFixed: 100 },
  };

  columnDefs: ColDef[] = [
    { headerName: 'id', field: 'id', sort: 'desc', sortable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'i18n', field: 'i18n' },
    { headerName: 'message', field: 'message', resizable: false },
    { headerName: '语言', field: 'language', enableRowGroup: true, checkboxSelection: true },
    { headerName: '类型', field: 'typeGroup', enableRowGroup: true },
    { headerName: 'md5', field: 'md5' },
    { headerName: '创建人', field: 'creator' },
    { headerName: '创建时间', field: 'createdTime', sortable: true },
    { headerName: '更新人', field: 'updater' },
    { headerName: '更新时间', field: 'updatedTime', sortable: true },
  ];

  gridOptions: GridOptions;

  @ViewChild(AgGridTableComponent)
  table!: AgGridTableComponent;

  constructor(private http: _HttpClient) {
    this.gridOptions = {
      enableCharts: false,
      columnDefs: this.columnDefs,
      // getRowNodeId: (data) => {
      //   return data.id;
      // },
      onFirstDataRendered(event: FirstDataRenderedEvent): void {
        event.columnApi.autoSizeAllColumns();
      },
    };
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

  onGridReady(e: { event: GridReadyEvent; gridTable: AgGridTableComponent }): void {
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
}
