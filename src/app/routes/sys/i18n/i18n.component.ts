import { AgEvent, ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from '@ag-grid-community/core';
import { CellValueChangedEvent, RowClickedEvent, RowNode } from '@ag-grid-enterprise/all-modules';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18NService } from '@core';
import { _HttpClient } from '@delon/theme';
import { AclColDef, arrayToObject, IPage, IRowQuery, NgxGridTableComponent } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { fromArray } from 'rxjs/internal/observable/fromArray';
import { mergeMap, multicast, share, switchMap, tap } from 'rxjs/operators';

declare type I18nType = 'server' | 'client';

interface I18n {
  id?: number;
  i18n: string;
  message: string;
  language: string;
  typeGroup: I18nType;
  md5: string;
}

const AUTO_FIELD_PREFIX = 'field_';

@Component({
  selector: 'app-sys-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.less'],
})
export class SysI18nComponent implements OnInit, OnDestroy {
  tabType$ = new BehaviorSubject<I18nType>('client');
  /**
   * 记录最大的列组数,即i18n按.拆分后最大的长度
   */
  maxPath = 0;
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

  api!: GridApi;
  columnApi!: ColumnApi;

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
  selectedLanguage: { [key: string]: string } | null = null;

  /**
   * 最后一次点击的国际化信息
   */
  selectedData?: I18n;

  newLanguage?: string;

  @ViewChild('formTemplate') formTemplate!: TemplateRef<void>;
  /**
   * 搜索值
   */
  searchValue = '';

  language$ = this.http.get(`/api/sys/i18n/language`).pipe(share());

  languageForm!: FormGroup;

  constructor(
    private http: _HttpClient,
    private modalService: NzModalService,
    private i18NService: I18NService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
  ) {
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
      suppressHorizontalScroll: true,
      groupRowRendererParams: {
        checkbox: true,
      },
      isExternalFilterPresent(): boolean {
        return true;
      },
      doesExternalFilterPass: (node: RowNode) => {
        return node && node.data && node.data.i18n.indexOf(this.searchValue) >= 0;
      },
      onRowClicked: this.onRowClicked.bind(this),
      getRowNodeId: (data) => data.md5,
    };
  }

  private static getGroupColDef(i: number): ColDef {
    return {
      headerName: 'field',
      hide: true,
      field: `${AUTO_FIELD_PREFIX}${i}`,
      rowGroup: true,
      valueGetter: (params) => (params && params.data && params.data._group ? params.data._group[i] : null),
      rowGroupIndex: i,
    } as ColDef;
  }

  ngOnInit(): void {
    this.languageForm = this.fb.group({
      i18n: ['', [Validators.required.bind(this)]],
    });

    this.tabType$
      .pipe(
        tap(() => (this.loadData = false)),
        switchMap((type) => this.http.get<Array<I18n>>(`/api/sys/i18n/all/${type}`)),
      )
      .subscribe((result) => {
        this.maxPath = 0;
        const data: Array<I18n & { [key: string]: any }> = [];
        const keyMap = new Map<string, Array<I18n>>();
        (result || []).forEach((item) => {
          const items: Array<I18n> = (keyMap.get(item.i18n) || []).concat(item);
          if (keyMap.has(item.i18n)) {
            keyMap.set(item.i18n, items);
            return;
          }
          keyMap.set(item.i18n, items);
          const nameArray = item.i18n.split('.');
          nameArray.splice(nameArray.length - 1, 1);
          this.maxPath = Math.max(this.maxPath, nameArray.length);
          data.push(Object.assign({}, item, { _group: nameArray }));
        });
        this.keyMap = keyMap;
        this.dataSource = (rowQuery: IRowQuery) =>
          of({
            records: data,
            total: data.length,
            size: data.length,
          } as IPage<I18n & { [key: string]: any }>);
        const columnDefs = [...this.defaultColumnDefs];
        for (let i = 0; i < this.maxPath; i++) {
          columnDefs.push(SysI18nComponent.getGroupColDef(i));
        }
        this.gridOptions.columnDefs = columnDefs;
        this.loadData = true;
      });
  }

  onGridReady(e: { event: GridReadyEvent; gridTable: NgxGridTableComponent }): void {
    this.api = e.event.api;
    this.columnApi = e.event.columnApi;
  }

  onSearch(): void {
    this.api?.onFilterChanged();
  }

  onRowClicked(event: RowClickedEvent): void {
    const { data } = event;
    if (data) {
      this.selectedData = data;
      const lang = this.keyMap.get(data.i18n) || [];
      this.selectedLanguage = arrayToObject(lang, (item) => ({ [item.language]: item.message }));
    }
  }

  addRow(data: I18n): void {
    const { i18n } = data;
    const paths: Array<string> = i18n.split('.');
    paths.splice(paths.length - 1, 1);
    const newData = Object.assign({}, data, { _group: paths });
    const colDefs = [];
    for (let len = paths.length - 1; len > this.maxPath - 1; len--) {
      colDefs.push(SysI18nComponent.getGroupColDef(len));
    }
    this.maxPath = Math.max(this.maxPath, paths.length);
    if (colDefs.length) {
      // this.api.getColumnDefs()方法存在bug,多次调用报异常,改为this.columnApi.getAllColumns()
      const columnDefs = this.columnApi.getAllColumns().map((c) => c.getColDef());
      const defs = colDefs.concat(...columnDefs);
      this.api.setColumnDefs(defs);
    }
    this.api.applyTransaction({ add: [newData] });
    const i18ns = this.keyMap.get(i18n) || [];
    this.keyMap.set(i18n, [...i18ns, data]);
  }

  onChangeType(type: I18nType): void {
    this.searchValue = '';
    this.selectedLanguage = null;
    this.selectedData = undefined;
    this.tabType$.next(type);
  }

  onSave(): void {
    const update = this.keyMap.get(this.selectedData!.i18n) || [];
    fromArray(update)
      .pipe(
        mergeMap((i18n) => {
          return this.http.post('/api/sys/i18n/create/language', i18n);
        }),
      )
      .subscribe(
        (next) => {},
        (err) => {},
        () => {
          this.messageService.success('保存成功~');
        },
      );
  }

  addLanguage(): void {
    if (this.newLanguage) {
      const { i18n } = this.selectedData!;
      const type = this.tabType$.value;
      const newData = { language: this.newLanguage, message: '', i18n, typeGroup: type.toUpperCase() } as I18n;
      this.http.post('/api/sys/i18n/create/language', newData).subscribe((next) => {
        this.keyMap.set(i18n, [...(this.keyMap.get(i18n) || []), Object.assign({ md5: next }, newData)]);
        this.selectedLanguage![this.newLanguage!] = '';
        this.newLanguage = '';
      });
    }
  }

  addI18n(): void {
    this.languageForm.reset();
    this.modalService.create({
      nzTitle: this.i18NService.fanyi('i18n.add.i18n'),
      nzContent: this.formTemplate,
      nzOnOk: () => {
        if (!this.languageForm.valid) {
          Object.values(this.languageForm.controls).forEach((control) => {
            control.markAsDirty();
            control.updateValueAndValidity();
            control.updateValueAndValidity();
          });

          return Promise.resolve(false);
        }
        const lang = this.i18NService.currentLang.replace('-', '_');
        const data = Object.assign(
          {
            language: lang,
            message: '',
            typeGroup: this.tabType$.value.toUpperCase(),
          },
          this.languageForm.value,
        );
        return this.http
          .post('/api/sys/i18n/create/language', data)
          .pipe(
            tap((md5) => {
              const row = Object.assign({ md5 }, data);
              this.addRow(row);
              this.api.dispatchEvent({ type: 'rowClicked', data: row } as AgEvent);
            }),
          )
          .toPromise();
      },
    });
  }

  onDelete(): void {
    const data = this.api?.getSelectedRows();
    if (!data || !data.length) {
      this.messageService.warning(this.i18NService.fanyi('i18n.delete.warning'));
      return;
    }
    this.modalService.confirm({
      nzContent: this.i18NService.fanyi('i18n.delete.confirm', { count: data.length }),
      nzOnOk: () => {
        return fromArray(data)
          .pipe(
            mergeMap(
              (item) =>
                this.http.delete(`/api/sys/i18n/delete/${item.i18n}`).pipe(
                  tap(() => {
                    this.api.applyTransaction({ remove: [item] });
                    this.keyMap.delete(item.i18n);
                  }),
                ),
              5,
            ),
          )
          .toPromise();
      },
    });
  }

  ngOnDestroy(): void {
    this.tabType$.complete();
  }
}
