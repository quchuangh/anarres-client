import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
})
export class SysOrganizationComponent implements OnInit {
  private menuEvent!: NzFormatEmitEvent;

  data: NzTreeNode[] = [];
  op!: string;
  item: any;
  delDisabled = false;

  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      code: { type: 'string', title: '公司编号' },
      sortRank: { type: 'number', title: '排序值' },
      roleCode: { type: 'string', title: '角色编号' },
      enabled: { type: 'boolean', title: '是否启用', default: true },
      description: { type: 'string', title: '描述', ui: { widget: 'textarea', grid: { span: 24 } } },
    },
    required: ['text'],
    ui: { grid: { md: 24, lg: 12 }, spanLabelFixed: 100 },
  };

  constructor(
    private http: _HttpClient,
    private arrSrv: ArrayService,
    private ccSrv: NzContextMenuService,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.http.get('/api/sys/organization/all').subscribe((res: any[]) => {
      this.data = this.arrSrv.arrToTreeNode(res, {
        titleMapName: 'name',
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
    this.http.post(`/api/sys/organization/${item.id ? 'update' : 'create'}`, item).subscribe(() => {
      if (item.id <= 0) {
        this.getData();
        this.op = '';
      } else {
        this.item = item;
        this.menuEvent.node!.title = item.text;
        this.menuEvent.node!.origin = item;
        this.op = 'view';
      }
      this.getData();
    });
  }

  del(): void {
    this.closeContextMenu();
    this.http.delete(`/api/sys/organization/delete/${this.item.id}`).subscribe(() => {
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
    return `确认删除【${this.menuEvent.node!.title}】以及所有子项吗？`;
  }

  move = (e: NzFormatBeforeDropEvent) => {
    // if (e.pos !== 0) {
    //   this.msg.warning(`只支持不同类目的移动，且无法移动至顶层`);
    //   return of(false);
    // }
    if (e.dragNode.origin.parent_id === e.node.origin.id) {
      return of(false);
    }
    const from = e.dragNode.origin.id;
    const to = e.node.origin.id;
    return this.http
      .post('/api/sys/organization/move', {
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
    this.item = e.node!.origin;
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
