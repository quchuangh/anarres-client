import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-grid-table-footer',
  template: `<ng-content></ng-content>`,
})
export class NgxGridTableFooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
