import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ag-grid-footer-bar',
  template: `<ng-content></ng-content>`,
})
export class AgGridFooterBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
