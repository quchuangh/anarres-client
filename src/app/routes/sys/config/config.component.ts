import { GridOptions, GridReadyEvent, ICellRendererParams } from '@ag-grid-community/core';
import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, OnInit, ViewChild } from '@angular/core';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AclColDef, asFilterInputPropertiesUI, IFilter, IGridDataSource, NgxGridTableComponent, NgxGridTableConstants } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import { SfQueryFormComponent } from 'src/app/shared/components/ngx-grid-table/sf-query-form/sf-query-form.component';
import { DataSourceUtils } from '../../DataSourceUtils';
import { SysConfigCreateAndUpdateComponent } from './modal/create-update.component';
import { SysConfigViewComponent } from './modal/view.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
})
export class SysConfigComponent implements OnInit {
  valueRegexList: Array<{ label: string; value: string }> = [
    { label: '不限制', value: '^.+$' },
    { label: '整数类型', value: '^(-|)\\d+$' },
    { label: '英文字母', value: '^[A-z]+$' },
    { label: '布尔类型', value: '^(false|true)$' },
    { label: '字符数组', value: '^\\w+(,\\w+)*$' },
  ];

  // properties 的定义为 filter-input.widget.ts -> FilterInputUISchema 接口
  // id会转换为 { type: 'integer', title: 'id', ui: { widget: 'filter-input', filterType: 'number', options: ['equals'] } }
  schema: SFSchema = asFilterInputPropertiesUI(
    {
      properties: {
        code: { type: 'string', title: '编码', ui: { options: ['contains'] } },
        value: { type: 'string', title: '值', ui: { options: ['contains'] } },
        creator: { type: 'string', title: '创建人', ui: { options: ['contains'] } },
        createdTime: { type: 'string', title: '创建时间', format: 'date-time', ui: { options: ['inRange'] } },
        updater: { type: 'string', title: '更新人', ui: { options: ['contains'] } },
        updatedTime: { type: 'string', title: '更新时间', format: 'date-time', ui: { options: ['inRange'] } },
      },
      required: ['text'],
      ui: {
        width: 275,
        spanLabelFixed: 80,
        optionShowType: 'symbol',
      },
    },
    'valueRegex',
  ); // valueRegex 不转成filter-input

  // 表格配置
  columnDefs: AclColDef[] = [
    // { headerName: 'testACL', field: 'testACL', acl: { ability: ['POST:/TEST'] } }, //加上acl后只有符合权限的才展示出来
    // { headerName: 'group', field: 'typeGroup', enableRowGroup: true }, // 需要分组查询，则将 enableRowGroup设置为true
    {
      headerName: 'id',
      field: 'id',
      sort: 'desc',
      sortable: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: '编码', field: 'code' },
    { headerName: '值', field: 'value' },
    {
      headerName: '值类型',
      field: 'valueRegex',
      valueFormatter: (params) => {
        if (params && params.value) {
          const value = this.valueRegexList.find((item) => item.value === params.value);
          return value ? value.label : params.value;
        }
        return null;
      },
    },

    { headerName: '创建人', field: 'creator' },
    { headerName: '创建时间', field: 'createdTime' },
    { headerName: '更新人', field: 'updater' },
    { headerName: '更新时间', field: 'updatedTime' },
    { headerName: '操作', field: NgxGridTableConstants.OPTION_FIELD, flex: 1 },
  ];

  gridOptions: GridOptions;

  dataSource: IGridDataSource<any>;

  @ViewChild(NgxGridTableComponent)
  table!: NgxGridTableComponent;

  constructor(
    private http: _HttpClient,
    private i18NService: I18NService,
    private msgSrv: NzMessageService,
    private aclService: ACLService,
    private modal: NzModalService,
  ) {
    this.gridOptions = {
      enableCharts: false,
      columnDefs: this.columnDefs,
      enableRangeSelection: true,
      getRowNodeId: (data) => {
        return data.id;
      },
      onFirstDataRendered(event: FirstDataRenderedEvent): void {
        event.columnApi.autoSizeAllColumns();
      },
    };
    this.dataSource = DataSourceUtils.rowQuery(http, '/api/config/query', (r) => r);
  }

  ngOnInit(): void {}

  onGridReady(e: { event: GridReadyEvent; gridTable: NgxGridTableComponent }): void {
    // 添加右键菜单
    /* this.table.addMenu({
       name: '删除',
       show: 'selected',
       acl: { ability: ['config:delete'] },
       callback: (selected) => {
         console.log(selected);
       },
     });*/
  }

  /**
   * IFilter表示查询条件。
   * 表格内置的 SfQueryFormComponent 将并根 SFSchema 来生成 IFilter 对象数组
   * 可以通过sf.value 将会获得每一个属性UI中填入的值。如果是 {widget: 'filter-input'} 的字段才自动将控件内填入的值转成 IFilter 对象
   * 其他非 filter-input 的控件，需要开发人员手动转换。
   * 如果开发人员需要给表格额外添加条件，也可以在这里加入更多的IFilter
   *
   * 自动生成的代码会将所有 SFSchema 的 UI 转成 filter-input，因此，默认是直接返回所有 filter
   * @param filter 所有filter-input生成的 IFilter对象
   * @param sf 表格的form对象。
   * @result 返回处理后的查询条件数组。
   */
  filterHand(filter: IFilter[], sf: SfQueryFormComponent): IFilter[] {
    // const v = sf.value.valueRegex;
    //
    // return [
    //   {
    //     field: 'valueRegex',
    //     filterType: 'text',
    //     option: 'equals',
    //     value: v,
    //   } as IFilter,
    //   ...filter,
    // ];
    return filter;
  }

  onPageIndexChange(index: number): void {}

  onCreate(): void {
    this.modal
      .create({
        nzTitle: this.i18NService.fanyi('app.config.create.title'),
        nzContent: SysConfigCreateAndUpdateComponent,
        nzComponentParams: { valueRegexList: this.valueRegexList },
        nzFooter: null,
        nzMaskClosable: false,
      })
      .afterClose.subscribe((result) => {
        if (result) {
          this.msgSrv.success(this.i18NService.fanyi('app.config.create.success'));
          this.table.refresh();
        }
      });
  }

  onDelete(cell: ICellRendererParams, row: RowNode): void {
    const { data } = row;
    this.modal.confirm({
      nzContent: this.i18NService.fanyi('app.config.delete.confirm'),
      nzOnOk: () => {
        return this.http
          .delete(`/api/config/delete/${data.id}`)
          .pipe(
            tap(() => {
              this.table.refresh();
            }),
          )
          .toPromise();
      },
    });
  }

  onEdit(cell: ICellRendererParams, row: RowNode): void {
    const { data } = row;
    const { id, valueRegex } = data;
    let regexList = this.valueRegexList;
    if (regexList.every((item) => item.value !== valueRegex)) {
      regexList = [...regexList, { label: valueRegex, value: valueRegex }];
    }
    this.modal
      .create({
        nzTitle: this.i18NService.fanyi('app.config.edit.title', { id }),
        nzContent: SysConfigCreateAndUpdateComponent,
        nzComponentParams: { data, valueRegexList: regexList, actionType: 'update' },
        nzFooter: null,
        nzMaskClosable: false,
      })
      .afterClose.subscribe((result) => {
        if (result) {
          this.msgSrv.success(this.i18NService.fanyi('app.config.edit.success'));
          this.table.refresh();
        }
      });
  }

  onView(cell: ICellRendererParams, row: RowNode): void {
    this.modal.create({
      nzContent: SysConfigViewComponent,
      nzComponentParams: { record: row.data },
      nzFooter: null,
      nzMaskClosable: true,
    });
  }
}
