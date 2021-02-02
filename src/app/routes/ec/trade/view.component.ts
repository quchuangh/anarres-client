import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-ec-trade-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ECTradeViewComponent implements OnInit {
  i: any = {};
  loading = false;

  constructor(private http: _HttpClient, private msg: NzMessageService, private drawer: NzDrawerRef, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loading = true;
    this.cd.detectChanges();
    this.http.get(`/trade/${this.i.id}`).subscribe((res) => {
      this.i = res;
      this.loading = false;
      this.cd.detectChanges();
    });
  }

  status(status: string): void {
    this.http
      .post('/trade/status', {
        id: this.i.id,
        status,
      })
      .subscribe((res: any) => {
        this.msg.success('Success');
        this.i = res.item;
        this.cd.detectChanges();
      });
  }

  close(): void {
    this.drawer.close();
  }
}
