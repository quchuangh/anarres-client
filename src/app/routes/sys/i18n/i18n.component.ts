import { ColDef, GridApi, GridOptions, GridReadyEvent } from '@ag-grid-community/core';
import { RowClickedEvent, RowNode } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AclColDef, IPage, IRowQuery, NgxGridTableComponent } from '@shared';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { switchMap, tap } from 'rxjs/operators';

declare type I18nType = 'server' | 'client';

interface I18n {
  id?: number;
  i18n: string;
  message: string;
  language: string;
  typeGroup: I18nType;
  md5?: string;
}

@Component({
  selector: 'app-sys-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.less'],
})
export class SysI18nComponent implements OnInit {
  tabType$ = new BehaviorSubject<I18nType>('client');

  gridOptions: GridOptions;

  // 表格配置
  defaultColumnDefs: AclColDef[] = [
    {
      headerName: 'id',
      field: 'id',

      hide: true,
    },
    {
      headerName: '编码',
      field: 'i18n',
      flex: 1,
      editable: true,
      checkboxSelection: true,
      valueFormatter: (params) => {
        if (params && params.value) {
          return params.value.replace(/^.*\./, '');
        }
        return null;
      },
      cellStyle: (params) => {
        const node = params.node;
        if (!node.allChildrenCount && node.level) {
          return { paddingLeft: `${node.level * 45}px` };
        }
        return null;
      },
    },
  ];

  api?: GridApi;

  /**
   * 数据载入中...
   */
  loadData = false;

  dataSource?: any;
  /**
   * i18n=>Array<I18n>>
   */
  keyMap = new Map<string, Array<I18n>>();

  /**
   * 当前选择的key已配置的语言列表
   */
  selectedLanguage: { [key: string]: I18n } | null = null;

  /**
   * 最后一次点击的国际化信息
   */
  selectedData?: I18n;
  /**
   * 取得数据后获取列表中语言最多的一个key，用来作为支持的语言列表
   */
  langItems: Array<string> = [];
  /**
   * 搜索值
   */
  searchValue = '';

  constructor(private http: _HttpClient) {
    this.gridOptions = {
      enableCharts: false,
      sideBar: false,
      headerHeight: 0,
      enableRangeSelection: true,
      suppressRowClickSelection: true,
      groupUseEntireRow: true,
      groupSelectsChildren: true,
      stopEditingWhenGridLosesFocus: true,
      rowSelection: 'multiple',
      groupRowRendererParams: {
        // puts a checkbox onto each group row
        checkbox: true,
      },
      isExternalFilterPresent(): boolean {
        return true;
      },
      doesExternalFilterPass: (node: RowNode) => {
        return node && node.data && node.data.i18n.indexOf(this.searchValue) >= 0;
      },
      onRowClicked: (event: RowClickedEvent) => {
        if (event.data) {
          this.selectedData = event.data;
          const lang = this.keyMap.get(event.data.i18n) || [];
          const selectedLanguage = lang
            .map((item) => ({ [item.language]: item }))
            .reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});
          this.langItems.forEach((item) => {
            if (!selectedLanguage[item]) {
              selectedLanguage[item] = {
                language: item,
                message: '',
                i18n: event.data.i18n,
                typeGroup: event.data.typeGroup,
              };
            }
          });
          this.selectedLanguage = selectedLanguage;
        }
      },
      getRowNodeId: (data) => data.id,
    };
  }

  ngOnInit(): void {
    this.tabType$
      .pipe(
        tap((next) => (this.loadData = false)),
        switchMap((type) => {
          return this.http.get<Array<I18n>>(`/api/sys/i18n/all/${type}`);
        }),
      )
      .subscribe((result) => {
        let maxPath = 0;
        const data: Array<I18n & { [key: string]: any }> = [];
        const keyMap = new Map<string, Array<I18n>>();
        (result || [])
          .sort((a, b) => (a.i18n > b.i18n ? 1 : -1))
          .forEach((item) => {
            const items: Array<I18n> = (keyMap.get(item.i18n) || []).concat(item);
            if (this.langItems.length < items.length) {
              this.langItems = items.map((item) => item.language);
            }
            if (keyMap.has(item.i18n)) {
              keyMap.set(item.i18n, items);
              return;
            }
            keyMap.set(item.i18n, items);
            const nameArray = item.i18n.split('.');
            nameArray.splice(nameArray.length - 1, 1);
            maxPath = Math.max(maxPath, nameArray.length);
            const nameObject = nameArray
              .map((name, index) => ({ [`name_${index}`]: name }))
              .reduce((previousValue, currentValue) => {
                return Object.assign(previousValue, currentValue);
              }, {});
            data.push(Object.assign({}, item, nameObject));
          });
        this.keyMap = keyMap;
        this.dataSource = (rowQuery: IRowQuery) =>
          of({
            records: data,
            total: data.length,
            size: data.length,
          } as IPage<I18n & { [key: string]: any }>);
        const columnDefs = [...this.defaultColumnDefs];
        for (let i = 0; i < maxPath; i++) {
          columnDefs.push({
            headerName: '路径',
            hide: true,
            field: `name_${i}`,
            rowGroup: true,
            rowGroupIndex: i,
          } as ColDef);
        }
        this.gridOptions.columnDefs = columnDefs;
        this.loadData = true;
      });
  }

  onGridReady(e: { event: GridReadyEvent; gridTable: NgxGridTableComponent }): void {
    this.api = e.event.api;
  }

  onSearch(): void {
    this.api?.onFilterChanged();
  }

  onChangeType(type: I18nType): void {
    this.searchValue = '';
    this.selectedLanguage = null;
    this.tabType$.next(type);
  }

  onSave(): void {
    console.log(this.selectedLanguage);
  }
}
