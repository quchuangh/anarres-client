import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ArticlesEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {
  @ViewChild('st', { static: true }) private readonly st!: STComponent;

  params: any = {};

  url = `/article`;

  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: 'Title', index: 'title' },
    { title: 'Likes', index: 'likes' },
    { title: 'Comments', index: 'comments' },
    {
      title: 'Created At',
      index: 'created',
      type: 'date',
    },
    {
      title: 'Status',
      index: 'status',
      type: 'tag',
      tag: {
        Published: { text: '已发布', color: 'green' },
        Draft: { text: '草稿', color: 'orange' },
        Deleted: { text: '已删除', color: 'red' },
      },
    },
    {
      title: '',
      buttons: [
        {
          icon: 'edit',
          type: 'static',
          modal: {
            component: ArticlesEditComponent,
            size: 'lg',
            paramsName: 'i',
          },
          click: 'load',
        },
        {
          icon: 'delete',
          type: 'del',
          click: (i, m, c) => {
            this.http.delete(`${this.url}`, { id: i.id }).subscribe(() => {
              this.msg.success('Success');
              c?.removeRow(i);
            });
          },
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private msg: NzMessageService, private modalHelper: ModalHelper) {}

  create(): void {
    this.modalHelper.createStatic(ArticlesEditComponent, {}, { size: 'lg' }).subscribe(() => this.st.reload());
  }
}
