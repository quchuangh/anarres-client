import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-table-header',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTableHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
