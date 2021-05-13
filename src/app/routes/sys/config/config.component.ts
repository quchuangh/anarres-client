import { GridOptions, GridReadyEvent, ICellRendererParams } from '@ag-grid-community/core';
import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ACLService } from '@delon/acl';
import { SFSchema, SFSchemaEnum, SFSelectWidgetSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AclColDef, asFilterInputPropertiesUI, IFilter, IGridDataSource, NgxGridTableComponent, NgxGridTableConstants } from '@shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { SfQueryFormComponent } from '../../../shared/components/ngx-grid-table/sf-query-form/sf-query-form.component';
import { DataSourceUtils } from '../../DataSourceUtils';
import { SysConfigCreateComponent } from './modal/create.component';
import { SysConfigEditComponent } from './modal/edit.component';
import { SysConfigViewComponent } from './modal/view.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
})
export class SysConfigComponent implements OnInit {
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
  ); //valueRegex 不转成filter-input

  // 表格配置
  columnDefs: AclColDef[] = [
    // { headerName: 'testACL', field: 'testACL', acl: { ability: ['POST:/TEST'] } }, //加上acl后只有符合权限的才展示出来
    // { headerName: 'group', field: 'typeGroup', enableRowGroup: true }, // 需要分组查询，则将 enableRowGroup设置为true
    { headerName: 'id', field: 'id', sort: 'desc', sortable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '编码', field: 'code' },
    { headerName: '值', field: 'value' },
    { headerName: '值类型', field: 'valueRegex' },
    { headerName: '创建人', field: 'creator' },
    { headerName: '创建时间', field: 'createdTime' },
    { headerName: '更新人', field: 'updater' },
    { headerName: '更新时间', field: 'updatedTime' },
    { headerName: '操作', field: NgxGridTableConstants.OPTION_FIELD },
  ];

  gridOptions: GridOptions;

  dataSource: IGridDataSource<any>;

  @ViewChild(NgxGridTableComponent)
  table!: NgxGridTableComponent;

  constructor(private http: _HttpClient, private aclService: ACLService, private modal: NzModalService) {
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

  valueRegexSearcher(q: string): Promise<Array<SFSchemaEnum>> {
    const r = { label: q, value: q } as SFSchemaEnum;
    return of([
      { label: '任意', value: '.*' },
      { label: '整数', value: 'n' },
      { label: '小数', value: 'xs' },
      { label: '字符', value: 'str' },
      { label: '布尔', value: 'bool' },
      r,
    ]).toPromise();
  }

  onGridReady(e: { event: GridReadyEvent; gridTable: NgxGridTableComponent }): void {
    // 添加右键菜单
    this.table.addMenu({
      name: '删除',
      show: 'selected',
      acl: { ability: ['config:delete'] },
      callback: (selected) => {
        console.log(selected);
      },
    });
    // 按每列内容重新分配列宽
    this.table.columnApi.autoSizeAllColumns();
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
        nzContent: SysConfigCreateComponent,
        nzComponentParams: { valueRegexSearcher: this.valueRegexSearcher },
        nzFooter: null,
        nzMaskClosable: false,
      })
      .afterClose.subscribe((result) => {
        this.table.refresh();
      });
  }

  onEdit(cell: ICellRendererParams, row: RowNode): void {
    this.modal
      .create({
        nzContent: SysConfigEditComponent,
        nzComponentParams: { record: row.data, valueRegexSearcher: this.valueRegexSearcher },
        nzFooter: null,
        nzMaskClosable: false,
      })
      .afterClose.subscribe((result) => {
        this.table.refresh();
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
