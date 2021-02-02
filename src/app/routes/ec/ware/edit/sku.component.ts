import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, OnDestroy, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { WareEditService } from './edit.service';

@Component({
  selector: 'app-ec-ware-edit-sku',
  templateUrl: './sku.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ECWareEditSkuComponent implements OnInit, OnDestroy {
  private notify$!: Subscription;

  get i(): any {
    return this.srv.i;
  }

  get cog(): any {
    return this.srv.cog;
  }

  get properties(): any[] {
    return this.cog.list.filter((w: NzSafeAny) => w.sel);
  }

  constructor(
    @Host() private srv: WareEditService,
    private cd: ChangeDetectorRef,
    public msg: NzMessageService,
    private http: _HttpClient,
  ) {}

  ngOnInit(): void {
    this.notify$ = this.srv.change
      .pipe(
        filter((type) => type === 'cat'),
        mergeMap(() => this.http.get('/ware/cat')),
      )
      .subscribe((res: any) => {
        this.srv.skuLoad(res).then(() => this.cho());
      });
  }

  cho(): void {
    this.srv.skuCho();
    this.srv.notify('img');
    setTimeout(() => this.cd.markForCheck());
  }

  getValidName(nams: string[]): string[] {
    return nams.filter((a) => !!a);
  }

  ngOnDestroy(): void {
    this.notify$.unsubscribe();
  }
}
