import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ag-grid-header-bar',
  template: `<ng-content></ng-content>`,
})
export class AgGridHeaderBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
