import { ColumnApi, GridApi } from '@ag-grid-community/core';
import { Component, Input, OnInit } from '@angular/core';
import { GridStatistics } from '../../../grid-model';

@Component({
  selector: 'default-grid-statistics-bar',
  templateUrl: './default-grid-statistics-bar.component.html',
  styleUrls: ['./default-grid-statistics-bar.component.less'],
})
export class DefaultGridStatisticsBarComponent implements OnInit {
  @Input() statistics: Array<GridStatistics> = [];

  @Input() subtotal: false | Array<string> = false;

  @Input() api!: GridApi;

  @Input() columnApi!: ColumnApi;

  constructor() {}

  ngOnInit(): void {}
}
