import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-table-footer',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTableFooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
