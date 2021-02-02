import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DrawerHelper, ScrollService, _HttpClient } from '@delon/theme';
import { ClientsViewComponent } from './view/view.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  s = {
    pi: 1,
    ps: 10,
    q: '',
  };
  total = 0;
  list!: any[];

  constructor(
    private http: _HttpClient,
    private cd: ChangeDetectorRef,
    private scroll: ScrollService,
    private drawerHelper: DrawerHelper,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(pi: number = 1): void {
    this.s.pi = pi;
    this.http.get('/client', this.s).subscribe((res: any) => {
      this.list = res.list;
      this.total = res.total;
      this.scroll.scrollToTop();
      this.cd.detectChanges();
    });
  }

  show(i: any): void {
    this.drawerHelper
      .create(
        ``,
        ClientsViewComponent,
        { i },
        {
          size: 'sm',
          drawerOptions: {
            nzTitle: undefined,
            nzBodyStyle: {
              'min-height': '100%',
              padding: 0,
            },
          },
        },
      )
      .subscribe();
  }
}
