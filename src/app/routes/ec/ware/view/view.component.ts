import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ec-ware-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ECWareViewComponent implements OnInit, OnDestroy {
  private route$!: Subscription;
  id = 0;
  i: any = {};
  tab = 0;

  getValidName(values: string[]): string[] {
    return values.filter((w) => !!w);
  }

  constructor(
    private route: ActivatedRoute,
    private http: _HttpClient,
    private msg: NzMessageService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route$ = this.route.params.subscribe((res) => {
      this.id = res.id || 0;
      this.load();
    });
  }

  private load(): void {
    this.http.get(`/ware/${this.id}`).subscribe((res: any) => {
      res.skus = res.skus || [];
      if (res.skus.length > 0) {
        res.properieNames = res.skus[0].attributes
          .split(':')
          .map((v: string) => +v)
          .filter((v: number) => v !== 0);
      }
      this.i = res;
      this.cd.detectChanges();
    });
  }

  status(status: string): void {
    this.http
      .post(`/ware/status`, {
        id: this.id,
        status,
      })
      .subscribe((res: any) => {
        this.msg.success(`${res.item.status === 'CUSTORMER_DOWN' ? '下' : '上'}架成功`);
        this.cd.detectChanges();
      });
  }

  cancel(): void {
    this.router.navigateByUrl('/ec/ware');
  }

  ngOnDestroy(): void {
    this.route$.unsubscribe();
  }
}
