import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { Menu, _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { ObjectSelectOption } from '@shared';

import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sys-menu',
  templateUrl: './menu.component.html',
})
export class SysMenuComponent implements OnInit {
  private menuEvent!: NzFormatEmitEvent;

  data: NzTreeNode[] = [];
  op!: string;
  item!: Menu;
  delDisabled = false;
  objectOptions: Map<string, ObjectSelectOption> = new Map<string, ObjectSelectOption>();
  schema: SFSchema = {
    properties: {
      text: { type: 'string', title: '名称', minLength: 1 },
      code: { type: 'string', title: '编号', minLength: 4 },
      i18n: { type: 'string', title: '国际化', minLength: 1 },
      acl: {
        type: 'string',
        title: 'ACL',
        ui: {
          widget: 'object-select',
          options: this.objectOptions,
        },
      },
      reuse: { type: 'boolean', title: '复用', default: false },
      link: { type: 'string', title: '路由', minLength: 1, default: '#' },
      target: {
        type: 'string',
        title: '跳转方式',
        default: '_self',
        enum: [
          { label: '_self', title: '_self', value: '_self', checked: true },
          { label: '_blank', title: '_blank', value: '_blank' },
          { label: '_parent', title: '_parent', value: '_parent' },
          { label: '_top', title: '_top', value: '_top' },
        ],
      },
      hide: { type: 'boolean', title: '隐藏', default: false },
      enabled: { type: 'boolean', title: '启用', default: true },
      hideInBreadcrumb: { type: 'boolean', title: '隐藏导航', default: false },
      canShortcut: { type: 'boolean', title: '允许快捷', default: false },
      icon: { type: 'string', title: '图标', default: '' },
      sortRank: { type: 'number', title: '排序值', default: 1 },
    },
    required: ['text'],
    ui: { grid: { md: 24, lg: 12 }, spanLabelFixed: 100 },
  };

  objectSelect = {};

  constructor(private http: _HttpClient, private ccSrv: NzContextMenuService, private arrSrv: ArrayService, private msg: NzMessageService) {
    this.objectOptions.set('a', {
      title: '角色',
      style: { width: '200px' },
      maxMultipleCount: 8,
      maxTagCount: 2,

      options: () =>
        of([
          { label: '11', value: 11 },
          {
            label: '22',
            value: 22,
          },
          { label: '33', value: 33, groupLabel: '角色' },
          {
            label: '44',
            value: 44,
          },
        ]).pipe(delay(5000)),
    });
    this.objectOptions.set('b', {
      title: '权限',
      style: { width: '100px' },
      mode: 'default',

      options: () =>
        of([
          { label: 'aa', value: 'aa' },
          { label: 'bb', value: 'bb' },
          { label: 'cc', value: 'cc' },
          {
            label: 'dd',
            value: 'dd',
          },
        ]),
    });
    this.objectOptions.set('c', {
      title: '其他',
      style: { width: '100px' },
      mode: 'default',
      options: () =>
        of([
          { label: 'gg', value: 'gg' },
          {
            label: 'hh',
            value: 'hh',
            groupLabel: '其他',
          },
          { label: 'jj', value: 'jj' },
          {
            label: 'kk',
            value: 'kk',
          },
        ]),
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  objectSelectChange(value: any): void {
    console.log(value);
  }

  private getData(): void {
    // https://ng-alain.com/util/array/zh?#arrToTree
    this.http.get('/api/sys/menu/all').subscribe((res: Menu[]) => {
      // res = res.map(item => {
      //   if(item.acl) {
      //     item.acl = JSON.parse(item.acl as string);
      //   } else {
      //     item.acl = {
      //       role: [],
      //       ability: []
      //     }
      //   }
      //   return item;
      // })
      this.data = this.arrSrv.arrToTreeNode(res, {
        titleMapName: 'text',
        parentIdMapName: 'parentId',
        cb: (item, _parent, deep) => {
          item.expanded = deep <= 1;
        },
      });
    });
  }

  add(item: any): void {
    this.closeContextMenu();
    this.op = 'edit';
    this.item = {
      id: 0,
      text: '',
      parentId: item ? item.id : 0,
    };
  }

  edit(): void {
    this.closeContextMenu();
    this.op = 'edit';
  }

  save(item: any): void {
    if (item.acl) {
      item = Object.assign({}, item, { acl: JSON.parse(item.acl) });
    }
    item.externalLink = '';
    this.http.post(`/api/sys/menu/${item.id ? 'update' : 'create'}`, item).subscribe(() => {
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
    this.http.delete(`/api/sys/menu/delete/${this.item.id}`).subscribe(() => {
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

  move = (e: NzFormatBeforeDropEvent) => {
    // if (e.pos !== 0) {
    //   this.msg.warning(`只支持菜单不同类目的移动，且无法移动至顶层`);
    //   return of(false);
    // }

    if (e.dragNode.origin.parent_id === e.node.origin.id) {
      return of(false);
    }
    const from = e.dragNode.origin.id;
    const to = e.node.origin.id;
    return this.http
      .post('/api/sys/menu/move', {
        from,
        to,
        pos: e.pos,
      })
      .pipe(
        tap(() => {
          this.op = '';
          this.getData();
        }),
        map((data) => false),
      );
    // tslint:disable-next-line: semicolon
  };

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
