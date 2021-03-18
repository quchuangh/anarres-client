import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ag-grid-query-form',
  template: `<ng-content></ng-content>`,
})
export class AgGridQueryFormComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
