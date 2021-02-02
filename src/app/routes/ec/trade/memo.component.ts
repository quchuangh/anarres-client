import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-ec-trade-memo',
  templateUrl: './memo.component.html',
})
export class ECTradeMemoComponent {
  i: any = {};

  constructor(private http: _HttpClient, private msg: NzMessageService, private drawer: NzDrawerRef) {}

  save(): void {
    this.http
      .post('/trade/memo', {
        id: this.i.id,
        memo: this.i.memo,
      })
      .subscribe(() => {
        this.msg.success('Success');
        this.drawer.close(this.i);
      });
  }

  close(): void {
    this.drawer.close();
  }
}
