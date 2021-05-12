import { GridOptions, GridReadyEvent, ICellRendererParams } from '@ag-grid-community/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ACLService } from '@delon/acl';
import { _HttpClient } from '@delon/theme';
import { AclColDef, IFilter, IGridDataSource, NgxGridTableComponent, NgxGridTableConstants } from '@shared';
import { SfQueryFormComponent } from '../../../../shared/components/ngx-grid-table/sf-query-form/sf-query-form.component';
import { DataSourceUtils } from '../../../DataSourceUtils';
import { SysDictItemCreateComponent } from './modal/create.component';
import { SysDictItemEditComponent } from './modal/edit.component';
import { SysDictItemViewComponent } from './modal/view.component';

@Component({
  selector: 'app-dict-item',
  templateUrl: './dict-item.component.html',
})
export class SysDictItemComponent implements OnInit {
  @Input()
  dict!: any;

  // 表格配置
  columnDefs: AclColDef[] = [
    { headerName: 'id', field: 'id', sort: 'desc', sortable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '名称', field: 'label' },
    { headerName: '值', field: 'val' },
    { headerName: '排序', field: 'sortRank' },
    { headerName: '类型编码', field: 'dictTypeCode' },
    { headerName: '父id', field: 'parentId' },
    { headerName: '路径', field: 'parents' },
    { headerName: '备注', field: 'description' },
    { headerName: '是否启用', field: 'enabled' },
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

  constructor(private http: _HttpClient, private aclService: ACLService, private message: NzMessageService, private modal: NzModalService) {
    this.gridOptions = {
      enableCharts: false,
      columnDefs: this.columnDefs,
      enableRangeSelection: true,
      getRowNodeId: this.idGetter,
      onFirstDataRendered(event: FirstDataRenderedEvent): void {
        event.columnApi.autoSizeAllColumns();
      },
    };
    this.dataSource = DataSourceUtils.rowQuery(http, '/api/dict/item/query', (r) => r);
  }

  ngOnInit(): void {}

  idGetter(data: any): any {
    return data.id;
  }

  onGridReady(e: { event: GridReadyEvent; gridTable: NgxGridTableComponent }): void {
    // 添加右键菜单
    this.table.addMenu({
      name: '删除',
      show: 'selected',
      acl: { ability: ['dictItem:delete'] },
      callback: (selected) => {
        this.http.delete(`/api/dict/item/delete/${this.idGetter(selected)}`).subscribe((value) => {
          this.message.success('删除成功');
          this.table.refresh();
        });
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
  filterHand = (filter: IFilter[], sf: SfQueryFormComponent): IFilter[] => {
    //不做任何处理，直接返回表格生成的filter对象数组。
    return [
      {
        field: 'dictTypeCode',
        filterType: 'text',
        option: 'equals',
        value: this.dict.code,
      },
      ...filter,
    ];
  };

  onCreate(): void {
    this.modal
      .create({
        nzContent: SysDictItemCreateComponent,
        nzComponentParams: { dict: this.dict },
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
        nzContent: SysDictItemEditComponent,
        nzComponentParams: { record: row.data },
        nzFooter: null,
        nzMaskClosable: false,
      })
      .afterClose.subscribe((result) => {
        this.table.refresh();
      });
  }

  onView(cell: ICellRendererParams, row: RowNode): void {
    this.modal.create({
      nzContent: SysDictItemViewComponent,
      nzComponentParams: { record: row.data },
      nzFooter: null,
      nzMaskClosable: true,
    });
  }

  onCreateChild(cell: ICellRendererParams, row: RowNode) {
    this.modal
      .create({
        nzContent: SysDictItemCreateComponent,
        nzComponentParams: { dict: this.dict, parentItem: row.data },
        nzFooter: null,
        nzMaskClosable: false,
      })
      .afterClose.subscribe((result) => {
        this.table.refresh();
      });
  }
}
