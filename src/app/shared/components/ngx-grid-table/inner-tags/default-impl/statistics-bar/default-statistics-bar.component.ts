import { ColumnApi, GridApi } from '@ag-grid-community/core';
import { Component, Input, OnInit } from '@angular/core';
import { GridStatistics } from '../../../ngx-grid-table-model';

@Component({
  selector: 'statistics-bar',
  templateUrl: './default-statistics-bar.component.html',
  styleUrls: ['./default-statistics-bar.component.less'],
})
export class DefaultStatisticsBarComponent implements OnInit {
  @Input() statistics: Array<GridStatistics> = [];

  @Input() subtotal: false | Array<string> = false;

  @Input() api!: GridApi;

  @Input() columnApi!: ColumnApi;

  constructor() {}

  ngOnInit(): void {}
}
