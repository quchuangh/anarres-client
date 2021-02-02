import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-thread',
  templateUrl: './thread.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumThreadComponent implements OnInit, OnDestroy {
  private router$!: Subscription;
  s = {
    pi: 1,
    ps: 10,
  };
  id = 0;
  i: any;

  constructor(
    private route: ActivatedRoute,
    private http: _HttpClient,
    public msg: NzMessageService,
    private cd: ChangeDetectorRef,
    private scroll: ScrollService,
  ) {}

  ngOnInit(): void {
    this.router$ = this.route.params.subscribe((res) => {
      this.id = res.id || 0;
      this.load();
    });
  }

  load(pi: number = 1): void {
    this.s.pi = pi;
    this.http.get(`/forum/thread/${this.id}`, this.s).subscribe((res: any) => {
      this.i = res;
      this.scroll.scrollToTop();
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.router$.unsubscribe();
  }
}
