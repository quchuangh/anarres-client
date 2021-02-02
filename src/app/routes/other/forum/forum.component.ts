import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumComponent implements OnInit {
  list!: any[];

  constructor(private http: _HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get('/forum/category').subscribe((res: any) => {
      this.list = res;
      this.cd.detectChanges();
    });
  }
}
