import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GridStatistics } from '../ngx-grid-table-model';

@Component({
  selector: 'ngx-table-statistics-bar',
  template: `
    <div *ngFor="let items of statistics" [attr.key]="items.func" [ngClass]="items.className" class="row flex flex-wrap">
      <label>{{ items.label }} &nbsp;&nbsp;-</label>
      <div *ngFor="let item of items.fields" [attr.key]="item.field" [ngClass]="item.className" class="row-value shadow-divider-right">
        <label>{{ item.label }}:</label><span class="value">{{ item.value }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTableStatisticsBarComponent implements OnInit {
  @Input() statistics: Array<GridStatistics> = [];

  @Input() subtotal: false | Array<string> = false;

  constructor() {}

  ngOnInit(): void {}
}
