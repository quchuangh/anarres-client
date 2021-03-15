import { ColumnApi, GridApi } from '@ag-grid-community/core';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GridStatistics } from '../grid-table';

@Component({
  selector: 'app-grid-statistics-bar',
  templateUrl: './grid-statistics-bar.component.html',
  styleUrls: ['./grid-statistics-bar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridStatisticsBarComponent implements OnInit {
  @Input()
  statistics: Array<GridStatistics> = [];

  @Input()
  subtotal: false | Array<string> = false;

  @Input()
  api!: GridApi;

  @Input()
  columnApi!: ColumnApi;

  constructor() {}

  ngOnInit(): void {}
}
