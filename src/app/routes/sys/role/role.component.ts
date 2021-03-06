import { GridOptions, GridReadyEvent, ICellRendererParams } from '@ag-grid-community/core';
import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleVO } from '@core';
import { ACLService } from '@delon/acl';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AclColDef, asFilterInputPropertiesUI, IFilter, IGridDataSource, NgxGridTableComponent, NgxGridTableConstants } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { SfQueryFormComponent } from '../../../shared/components/ngx-grid-table/sf-query-form/sf-query-form.component';
import { DataSourceUtils } from '../../DataSourceUtils';
import { SysRoleCreateComponent } from './modal/create.component';
import { SysRoleEditComponent } from './modal/edit.component';
import { SysRoleViewComponent } from './modal/view.component';

@Component({
  host: { class: 'flex flex-column flex-grow-1' },
  selector: 'app-role',
  templateUrl: './role.component.html',
})
export class SysRoleComponent implements OnInit {
  // properties 的定义为 filter-input.widget.ts -> FilterInputUISchema 接口
  // id会转换为 { type: 'integer', title: 'id', ui: { widget: 'filter-input', filterType: 'number', options: ['equals'] } }
  schema: SFSchema = asFilterInputPropertiesUI({
    properties: {
      id: { type: 'integer', title: 'id', ui: { options: ['equals'] } },
      role: { type: 'string', title: '角色标识', ui: { options: ['contains'] } },
      name: { type: 'string', title: '名称', ui: { options: ['contains'] } },
      description: { type: 'string', title: '简介', ui: { options: ['contains'] } },
      roleType: {
        type: 'array',
        title: '角色类型',
        ui: {
          options: ['in'],
          selectValues: [
            { label: '用户角色', value: 'USER_ROLE' },
            { label: '组织角色', value: 'ORG_ROLE' },
            { label: '职位角色', value: 'POS_ROLE' },
          ],
        },
      },
      enabled: {
        type: 'array',
        title: '是否启用',
        ui: {
          options: ['in'],
          selectValues: [
            { label: '是', value: true },
            { label: '否', value: false },
          ],
        },
      },
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
      // aclTmpl: 'POST:/{}/OUT',
      // acl: { ability: ['POST:/TEST0'] },
    },
  });

  // 表格配置
  columnDefs: AclColDef[] = [
    // { headerName: 'testACL', field: 'testACL', acl: { ability: ['POST:/TEST'] } }, //加上acl后只有符合权限的才展示出来
    // { headerName: 'group', field: 'typeGroup', enableRowGroup: true }, // 需要分组查询，则将 enableRowGroup设置为true
    { headerName: 'id', field: 'id', sort: 'desc', sortable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: '角色标识', field: 'role' },
    { headerName: '名称', field: 'name' },
    { headerName: '简介', field: 'description' },
    { headerName: '是否启用', field: 'enabled' },
    { headerName: '创建人', field: 'creator' },
    { headerName: '创建时间', field: 'createdTime' },
    { headerName: '更新人', field: 'updater' },
    { headerName: '更新时间', field: 'updatedTime' },
    { headerName: '操作', field: NgxGridTableConstants.OPTION_FIELD },
  ];

  gridOptions: GridOptions;

  dataSource: IGridDataSource<RoleVO>;

  assignRole: RoleVO | null = null;

  resizeId = -1;

  height: string | number = '70%';

  @ViewChild(NgxGridTableComponent)
  table!: NgxGridTableComponent;

  constructor(private http: _HttpClient, private aclService: ACLService, private msgSvr: NzMessageService, private modal: NzModalService) {
    this.gridOptions = {
      enableCharts: false,
      columnDefs: this.columnDefs,
      enableRangeSelection: true, // 范围选择
      getRowNodeId: this.idGetter,
      onFirstDataRendered(event: FirstDataRenderedEvent): void {
        event.columnApi.autoSizeAllColumns();
      },
    };
    this.dataSource = DataSourceUtils.rowQuery(http, '/api/role/query', (r) => r);
  }

  ngOnInit(): void {}

  onGridReady(e: { event: GridReadyEvent; gridTable: NgxGridTableComponent }): void {
    // 添加右键菜单
    this.table.addMenu({
      name: '删除',
      show: 'selected',
      acl: { ability: ['role:delete'] },
      callback: (selected) => {
        this.http.delete(`/api/role/delete/${this.idGetter(selected)}`).subscribe((value) => {
          this.msgSvr.success('删除成功');
          this.table.refresh();
        });
      },
    });
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
    //不做任何处理，直接返回表格生成的filter对象数组。
    return filter;
  }

  onPageIndexChange(index: number): void {
    console.log(index);
  }

  onCreate(): void {
    this.modal
      .create({
        nzContent: SysRoleCreateComponent,
        nzFooter: null,
        nzMaskClosable: false,
      })
      .afterClose.subscribe((res) => {
        this.table.refresh();
        if (res.assign) {
          this.openAssignResources(res.result);
        }
      });
  }

  onEdit(cell: ICellRendererParams, row: RowNode): void {
    this.modal
      .create({
        nzContent: SysRoleEditComponent,
        nzFooter: null,
        nzComponentParams: { record: row.data },
        nzMaskClosable: false,
      })
      .afterClose.subscribe((result) => {
        this.table.refresh();
      });
  }

  onView(cell: ICellRendererParams, row: RowNode): void {
    this.modal.create({
      nzContent: SysRoleViewComponent,
      nzFooter: null,
      nzComponentParams: { record: row.data },
      nzMaskClosable: true,
    });
  }

  onAssign(cell: ICellRendererParams, row: RowNode): void {
    this.openAssignResources(row.data);
  }

  openAssignResources(role: RoleVO) {
    this.assignRole = role;
  }

  closeAssignResources(): void {
    this.assignRole = null;
  }

  idGetter(data: any): any {
    return data.id;
  }

  onResize($event: NzResizeEvent) {
    cancelAnimationFrame(this.resizeId);
    this.resizeId = requestAnimationFrame(() => {
      let { height } = $event;
      if (height) {
        this.height = height;
      }
    });
  }
}
