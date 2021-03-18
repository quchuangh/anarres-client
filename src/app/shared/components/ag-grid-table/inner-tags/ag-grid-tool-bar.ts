import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ag-grid-tool-bar',
  template: `<ng-content></ng-content>`,
})
export class AgGridToolBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
