import { FirstDataRenderedEvent } from '@ag-grid-community/core/dist/cjs/events';
import { Component, Input, OnInit } from '@angular/core';
import { AbilityVO, RoleVO } from '@core';
import { _HttpClient } from '@delon/theme';
import { ColDef, GridOptions, GridReadyEvent, MenuItemDef, GetContextMenuItemsParams, GridApi } from '@ag-grid-community/core';
import { IGridDataSource, NgxGridTableComponent } from '@shared';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ACLService, ACLType } from '@delon/acl';
import { of } from 'rxjs';
import { DataSourceUtils } from '../../../../../DataSourceUtils';
import { SysRolesAbilityCellRendererComponent } from './ability-cell-renderer/ability-cell-renderer.component';

@Component({
  selector: 'app-sys-role-assign-ability-table',
  templateUrl: './assign-ability-table.component.html',
  styleUrls: ['./assign-ability-table.component.less'],
})
export class SysRoleAssignAbilityTableComponent implements OnInit {
  gridOptions!: GridOptions;

  table!: NgxGridTableComponent;

  dataSource!: IGridDataSource<AbilityVO>;

  @Input()
  role!: RoleVO;

  roleAbilities = [];

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', hide: true, suppressMenu: true },
    { headerName: '权限路径', field: 'name', width: 150, suppressMenu: true },
    { headerName: '顺序', field: 'sort', suppressMenu: true, sortable: true, sort: 'asc', hide: true },
    {
      headerName: '权限',
      suppressMenu: true,
      width: 500,
      field: 'resources',

      valueGetter: (params) => {
        if (params && params.data && params.data.resources) {
          return params.data.resources
            .sort((a: any, b: any) => (a.sort ? a.sort : 0) - (b.sort ? b.sort : 0))
            .map((item: any) => item.name)
            .join(' ');
        }
        return '';
      },
      cellRendererFramework: SysRolesAbilityCellRendererComponent,
    },
  ] as ColDef[];

  constructor(private http: _HttpClient, private aclService: ACLService, private drawerService: NzDrawerService) {}

  ngOnInit() {
    let canAssignAbility = this.aclService.canAbility('role:assign');
    this.gridOptions = {
      enableCharts: false,
      columnDefs: this.columnDefs,
      enableRangeSelection: true, // 范围选择
      getRowNodeId: (data) => {
        return data.id;
      },
      onFirstDataRendered(event: FirstDataRenderedEvent): void {
        event.columnApi.autoSizeAllColumns();
      },
    };
    this.dataSource = DataSourceUtils.of(() => (canAssignAbility ? this.http.get(`/api/role/${this.role.id}/abilities`) : of([])));
    this.table.addMenu({
      name: '全选',
      icon: '<i class="mdi ag-icon mdi-clipboard-text"></i>',
      callback: (selected, params) => {
        let data = params.node.data;
        let resources = data.resources.map((item: any) => {
          return Object.assign({}, item, { checked: true });
        });
        let newData = Object.assign({}, data, { resources });
        params.node.setData(newData);
        params.api!.refreshCells({ rowNodes: [params.node], force: true });
      },
      show: 'selected',
    });
    this.table.addMenu({
      name: '全不选',
      icon: '<i class="mdi ag-icon mdi-clipboard-text"></i>',
      callback: (selected, params) => {
        let data = params.node.data;
        let resources = data.resources.map((item: any) => {
          return Object.assign({}, item, { checked: false });
        });
        let newData = Object.assign({}, data, { resources });
        params.node.setData(newData);
        params.api!.refreshCells({ rowNodes: [params.node], force: true });
      },
      show: 'selected',
    });
  }

  onGridReady(event: GridReadyEvent, table: NgxGridTableComponent) {
    event.columnApi.autoSizeAllColumns();
    this.table = table;
  }

  /**
   * 平铺权限树
   * @param response
   * @param parents
   * @param result
   */
  builderRowData(response: Array<any>, parents = [], result = []) {
    // response.forEach(item => {
    //   if (item.children && item.children.length) {
    //     let _parents = [...parents, {
    //       id: item.source.id,
    //       sort: item.source.sort,
    //       name: item.source.name,
    //       value: item.source.value
    //     }];
    //     this.builderRowData(item.children, _parents, result);
    //   } else {
    //     let source = Object.assign({parent: parents}, item, item.source || {});
    //     delete source.source;
    //     result.push(source);
    //   }
    // });
    return result;
  }

  /**
   *
   * @param rowData
   */
  builderTableStore(rowData: Array<{ type: number; parent: Array<any>; sort?: number } & {}>): void {
    // let map = new Map<string, { resources: Array<any> & {} }>();
    // rowData.forEach(item => {
    //   if (item.type === 2) {
    //     let row;
    //     let parent = item.parent || [];
    //     if (parent && parent.length) {
    //       row = parent.reduce((previousValue, currentValue) => {
    //         let id = previousValue.id ? [previousValue.id, currentValue.id].join("/") : currentValue.id;
    //         let name = previousValue.name ? [previousValue.name, currentValue.name].join("/") : currentValue.name;
    //         let sort = previousValue.sort ? [previousValue.sort, currentValue.sort].join('') : currentValue.sort;
    //         return {id, name, sort};
    //       }, {});
    //     } else {
    //       row = {id: '/', name: '/', sort: item.sort};
    //     }
    //     delete item.parent;
    //     if (map.has(row.id)) {
    //       map.get(row.id).resources.push(item);
    //     } else {
    //       map.set(row.id, Object.assign(row, {parent: parent, resources: [item]}))
    //     }
    //   }
    // });
    // return Array.from(map.values());
  }

  fieldChange(value: any, rows: any) {
    // this.roleFields = value;
  }

  getNewData() {
    // let resources = [];
    // this.table.api.forEachNode(rowNode => {
    //   if (rowNode.data && rowNode.data.resources) {
    //     let ids = rowNode.data.resources.filter(item => item.checked).map(item => item.id);
    //     if (ids && ids.length) {
    //       resources.push(...ids);
    //       let parents = rowNode.data.parent.map(item => item.id);
    //       if (parents && parents.length) {
    //         resources.push(...parents);
    //       }
    //     }
    //   }
    // });
    // return {resources: Array.from(new Set(resources)), fields: [...this.roleFields]};
  }
}
