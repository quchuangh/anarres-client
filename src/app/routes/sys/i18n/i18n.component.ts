import {Component, OnInit} from '@angular/core';
import {SysI18n} from '@core';
import {SFSchema} from '@delon/form';
import {_HttpClient} from '@delon/theme';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzFormatEmitEvent} from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-sys-i18n',
  templateUrl: './i18n.component.html',
})
export class SysI18nComponent implements OnInit {
  private menuEvent!: NzFormatEmitEvent;

  data: SysI18n[] = [];
  op!: string;
  item!: SysI18n;
  delDisabled = false;

  schema: SFSchema = {
    properties: {
      text: { type: 'string', title: '名称', minLength: 1 },
      code: { type: 'string', title: '编号', minLength: 4 },
      i18n: { type: 'string', title: '国际化', minLength: 1 },
      group: { type: 'boolean', title: '菜单组', default: false },
      acl: { type: 'string', title: 'ACL', default: ''},
      reuse: { type: 'boolean', title: '复用', default: false },
      link: { type: 'string', title: '路由', minLength: 1, default: '#' },
      hide: { type: 'boolean', title: '隐藏', default: false},
      enabled: { type: 'boolean', title: '启用', default: true },
      hideInBreadcrumb: { type: 'boolean', title: '隐藏导航', default: false },
      canShortcut: { type: 'boolean', title: '允许快捷' , default: false },
      icon: { type: 'string', title: '图标', default: ''},
      sortRank: { type: 'number', title: '排序值' },
    },
    required: ['text'],
    ui: { grid: { md: 24, lg: 12 }, spanLabelFixed: 100 },
  };

  constructor(
    private http: _HttpClient,
    private ccSrv: NzContextMenuService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.http.get('/api/sys/i18n/all').subscribe((res: SysI18n[]) => {
      this.data = res;
    });
  }

  add(item: any): void {
    this.closeContextMenu();
    this.op = 'edit';
    this.item = {
      key: '',
      typeGroup: 'SERVER',
      i18n: '',
      lang: []
    };
  }

  edit(): void {
    this.closeContextMenu();
    this.op = 'edit';
  }

  save(item: any): void {
    this.http.post('/api/sys/menu/save', item).subscribe(() => {
      if (item.id <= 0) {
        this.getData();
        this.op = '';
      } else {
        this.item = item;
        this.menuEvent.node!.title = item.text;
        this.menuEvent.node!.origin = item;
        this.op = 'view';
      }
    });
  }

  del(): void {
    this.closeContextMenu();
    this.http.delete(`/api/sys/menu/delete/${this.item.key}`).subscribe(() => {
      this.getData();
      this.op = '';
    });
  }

  get delMsg(): string {
    if (!this.menuEvent) {
      return '';
    }
    const childrenLen = this.menuEvent.node!.children.length;
    if (childrenLen === 0) {
      return `确认删除【${this.menuEvent.node!.title}】吗？`;
    }
    return `确认删除【${this.menuEvent.node!.title}】以及所有子菜单吗？`;
  }


  show(e: NzFormatEmitEvent): void {
    this.op = e.node!.isSelected ? 'view' : '';
    this.item = e.node!.origin as any;
  }

  showContextMenu(e: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    this.menuEvent = e;
    this.delDisabled = e.node!.children.length !== 0;
    this.ccSrv.create(e.event!, menu);
  }

  closeContextMenu(): void {
    this.ccSrv.close();
  }
}
