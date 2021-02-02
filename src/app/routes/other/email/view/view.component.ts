import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailViewComponent implements OnInit, OnDestroy {
  private router$!: Subscription;
  menuVisible = false;
  id = 0;
  i: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: _HttpClient,
    private cd: ChangeDetectorRef,
    public msg: NzMessageService,
    private loc: Location,
  ) {}

  ngOnInit(): void {
    this.router$ = this.route.params.subscribe((res) => {
      this.id = res.id || 0;
      this.load();
    });
  }

  load(): void {
    this.http.get(`/email/${this.id}`).subscribe(
      (res: any) => {
        this.i = res;
        this.cd.detectChanges();
      },
      () => this.router.navigateByUrl(`/other/email`),
    );
  }

  back(): void {
    this.loc.back();
  }

  ngOnDestroy(): void {
    this.router$.unsubscribe();
  }
}
