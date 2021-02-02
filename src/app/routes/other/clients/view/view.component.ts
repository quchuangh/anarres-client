import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-clients-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsViewComponent implements OnInit {
  i: any;

  constructor(private http: _HttpClient, private cd: ChangeDetectorRef, public msg: NzMessageService) {}

  ngOnInit(): void {
    this.http.get(`/client/${this.i.id}`).subscribe((res: any) => {
      this.i = res;
      this.cd.detectChanges();
    });
  }
}
