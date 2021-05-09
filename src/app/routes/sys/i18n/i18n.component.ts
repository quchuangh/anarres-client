import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { groupBy } from '@shared';

@Component({
  selector: 'app-sys-i18n',
  templateUrl: './i18n.component.html',
  styles: [
    `
      .demo-infinite-container {
        height: 500px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
      }

      nz-list-item {
        padding: 0;
      }
    `,
  ],
})
export class SysI18nComponent implements OnInit {
  tabType: 'server' | 'client' = 'client';

  data!: { [i18n: string]: Array<{ i18n: string; message: string; language: string }> };
  i18ns!: string[];

  constructor(private http: _HttpClient) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.http.get(`/api/sys/i18n/all/${this.tabType}`).subscribe((result) => {
      const data = result.sort((a: any, b: any) => {
        const nameA = a.i18n.toUpperCase(); // ignore upper and lowercase
        const nameB = b.i18n.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      this.data = groupBy(data, (item) => item.i18n);
      this.i18ns = Object.keys(this.data);
    });
  }
}
