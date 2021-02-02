import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingComponent {
  params: any = {};
  url = `/billing`;
  columns: STColumn[] = [
    {
      title: 'ID',
      index: 'id',
      type: 'checkbox',
      selections: [
        {
          text: 'Rejected',
          select: (data: any[]) => data.forEach((item) => (item.checked = item.status === 'Rejected')),
        },
        {
          text: 'Pending',
          select: (data: any[]) => data.forEach((item) => (item.checked = item.status === 'Pending')),
        },
        {
          text: 'Completed',
          select: (data: any[]) => data.forEach((item) => (item.checked = item.status === 'Completed')),
        },
      ],
    },
    { title: 'ORDER', index: 'order' },
    { title: 'CLIENT', index: 'client' },
    { title: 'AMOUNT', index: 'amount', type: 'currency' },
    { title: 'DATE', index: 'date', type: 'date', dateFormat: 'dd MMM' },
    { title: 'STATUS', index: 'status', render: 'status' },
  ];

  constructor(public msg: NzMessageService) {}
}
