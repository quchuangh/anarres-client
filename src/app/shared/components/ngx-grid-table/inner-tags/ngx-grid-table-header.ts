import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-grid-table-header',
  template: `<ng-content></ng-content>`,
})
export class NgxGridTableHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
