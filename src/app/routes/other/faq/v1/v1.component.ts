import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { BrandService } from '@brand';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-faq-v1',
  templateUrl: './v1.component.html',
})
export class FAQV1Component implements OnInit {
  list!: any[];

  constructor(private http: _HttpClient, public msg: NzMessageService, public brand: BrandService, @Inject(DOCUMENT) private doc: any) {}

  ngOnInit(): void {
    this.http.get('/faq').subscribe((res: any[]) => (this.list = res));
  }

  to(idx: number): void {
    const el = this.doc.querySelector(`#faq-panel-${idx}`);
    if (!el) {
      return;
    }
    el.scrollIntoView();
  }
}
