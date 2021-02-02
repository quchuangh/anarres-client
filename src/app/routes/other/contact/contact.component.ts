import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ScrollService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  s = {
    pi: 1,
    ps: 10,
  };
  total = 0;
  list!: any[];

  constructor(private http: _HttpClient, private cd: ChangeDetectorRef, public msg: NzMessageService, private scroll: ScrollService) {}

  ngOnInit(): void {
    this.load();
  }

  load(pi: number = 1): void {
    this.s.pi = pi;
    this.http.get('/contact', this.s).subscribe((res: any) => {
      this.list = res.list;
      this.total = res.total;
      this.scroll.scrollToTop();
      this.cd.detectChanges();
    });
  }

  del(i: any, idx: number): void {
    this.http.delete('/contact', { id: i.id }).subscribe(() => {
      this.msg.success('Success');
      this.list.splice(idx, 1);
      this.cd.detectChanges();
    });
  }
}
