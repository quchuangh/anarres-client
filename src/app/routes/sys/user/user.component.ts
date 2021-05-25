import { GridOptions, GridReadyEvent, ICellRendererParams } from '@ag-grid-community/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ACLService } from '@delon/acl';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AclColDef, asFilterInputPropertiesUI, IFilter, IGridDataSource, NgxGridTableComponent, NgxGridTableConstants } from '@shared';
import { SfQueryFormComponent } from '../../../shared/components/ngx-grid-table/sf-query-form/sf-query-form.component';
import { DataSourceUtils } from '../../DataSourceUtils';
import { SysUserAppointmentComponent } from './modal/appointment.component';
import { SysUserChangePwdComponent } from './modal/change-pwd.component';
import { SysUserCreateComponent } from './modal/create.component';
import { SysUserEditComponent } from './modal/edit.component';
import { SysUserAssignComponent } from './modal/assign.component';
import { SysUserJoinGroupComponent } from './modal/join-group.component';
import { SysUserViewComponent } from './modal/view.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class SysUserComponent implements OnInit {
  // properties 的定义为 filter-input.widget.ts -> FilterInputUISchema 接口
  // id会转换为 { type: 'integer', title: 'id', ui: { widget: 'filter-input', filterType: 'number', options: ['equals'] } }
  schema: SFSchema = asFilterInputPropertiesUI({
    properties: {
      id: { type: 'integer', title: 'id', ui: { options: ['equals'] } },
      username: { type: 'string', title: '账号', ui: { options: ['contains'] } },
      // 所有未知的复杂类型都当作枚举处理
      state: {
        type: 'array',
        title: '状态',
        ui: {
          options: ['in'],
          selectValues: [
            { label: '正常', value: 'NORMAL' },
            { label: '锁定', value: 'LOCKED' },
          ],
        },
      },
      ipBound: { type: 'string', title: '绑定IP', ui: { options: ['contains'] } },
      macBound: { type: 'string', title: '绑定MAC', ui: { options: ['contains'] } },
      creator: { type: 'string', title: '创建人', ui: { options: ['contains'] } },
      createdTime: { type: 'string', title: '创建时间', format: 'date-time', ui: { options: ['inRange'] } },
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
    { headerName: '操作', field: NgxGridTableConstants.OPTION_FIELD },
    { headerName: '账号', field: 'username' },
    { headerName: '状态', field: 'state' },
    { headerName: '登录次数', field: 'loginTimes' },
    { headerName: '最后登录时间', field: 'lastLoginTime' },
    { headerName: '最后登录IP', field: 'lastLoginIp' },
    { headerName: '登录成功次数', field: 'loginSuccessTimes' },
    { headerName: '绑定IP', field: 'ipBound' },
    { headerName: '绑定MAC', field: 'macBound' },
    { headerName: '是否删除', field: 'deleted' },
    { headerName: '创建人', field: 'creator' },
    { headerName: '创建时间', field: 'createdTime' },
    { headerName: '更新人', field: 'updater' },
    { headerName: '更新时间', field: 'updatedTime' },
  ];

  gridOptions: GridOptions;

  dataSource: IGridDataSource<any>;

  @ViewChild(NgxGridTableComponent)
  table!: NgxGridTableComponent;

  constructor(private http: _HttpClient, private aclService: ACLService, private message: NzMessageService, private modal: NzModalService) {
    this.gridOptions = {
      enableCharts: false,
      sideBar: 'default',
      columnDefs: this.columnDefs,
      enableRangeSelection: true,
      getRowNodeId: this.idGetter,
      onFirstDataRendered(event: FirstDataRenderedEvent): void {
        event.columnApi.autoSizeAllColumns();
      },
    };
    this.dataSource = DataSourceUtils.rowQuery(http, '/api/user/query', (r) => r);
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
      acl: { ability: ['user:delete'] },
      callback: (selected) => {
        this.http.delete(`/api/user/delete/${this.idGetter(selected)}`).subscribe((value) => {
          this.message.success('删除成功');
          this.table.refresh();
        });
      },
    });

    this.table.addMenu({
      name: '强制修改密码',
      show: 'selected',
      acl: { ability: ['user:force-change-pwd'] },
      callback: (selected) => {
        this.modal
          .create({
            nzContent: SysUserChangePwdComponent,
            nzComponentParams: { user: selected, force: true },
            nzFooter: null,
            nzMaskClosable: false,
          })
          .afterClose.subscribe((result) => {
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
    return filter;
  };

  onPageIndexChange(index: number): void {}

  onCreate(): void {
    this.modal
      .create({
        nzContent: SysUserCreateComponent,
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
        nzContent: SysUserEditComponent,
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
      nzContent: SysUserViewComponent,
      nzComponentParams: { record: row.data },
      nzFooter: null,
      nzMaskClosable: true,
    });
  }

  assignRole(cell: any, row: any): void {
    this.modal.create({
      nzContent: SysUserAssignComponent,
      nzComponentParams: { user: row.data },
      nzFooter: null,
      nzMaskClosable: true,
    });
  }

  joinGroup(cell: any, row: any): void {
    this.modal.create({
      nzContent: SysUserJoinGroupComponent,
      nzComponentParams: { user: row.data },
      nzFooter: null,
      nzMaskClosable: true,
    });
  }

  appointment(cell: any, row: any): void {
    this.modal.create({
      nzContent: SysUserAppointmentComponent,
      nzComponentParams: { user: row.data },
      nzFooter: null,
      nzMaskClosable: true,
    });
  }
}
