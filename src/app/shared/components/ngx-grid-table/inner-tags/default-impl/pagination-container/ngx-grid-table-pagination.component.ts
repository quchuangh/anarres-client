import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { PaginationCfg } from '@shared';

@Component({
  selector: 'ngx-grid-table-pagination',
  templateUrl: './ngx-grid-table-pagination.component.html',
  styleUrls: ['./ngx-grid-table-pagination.component.less'],
})
export class NgxGridTablePaginationComponent implements OnInit {
  @Input() pageIndex = 1;
  @Input() pageSize = 50;
  @Input() total = 0;
  @Input() cfg!: PaginationCfg;

  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() pageIndexChange = new EventEmitter<number>();

  ngOnInit(): void {}

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageSizeChange.emit(size);
  }

  onPageIndexChange(idx: number): void {
    this.pageIndex = idx;
    this.pageIndexChange.emit(idx);
  }
}
