import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

import { WareEditService } from './edit.service';

@Component({
  selector: 'app-ec-ware-edit',
  templateUrl: './edit.component.html',
  viewProviders: [WareEditService],
})
export class ECWareEditComponent implements OnInit, OnDestroy {
  private route$!: Subscription;
  id = 0;

  get i(): any {
    return this.srv.i;
  }

  constructor(
    private srv: WareEditService,
    private route: ActivatedRoute,
    private http: _HttpClient,
    public msg: NzMessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route$ = this.route.params.subscribe((res) => {
      this.id = res.id || 0;
      this.srv.load(this.id);
    });
  }

  save(): void {
    this.http.post('/ware', this.srv.getSaveData()).subscribe(() => {
      this.msg.success('Save Success!');
      this.cancel();
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/ec/ware');
  }

  ngOnDestroy(): void {
    this.route$.unsubscribe();
  }
}
