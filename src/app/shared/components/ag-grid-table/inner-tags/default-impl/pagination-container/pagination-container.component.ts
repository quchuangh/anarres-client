import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { PaginationCfg } from '@shared';

@Component({
  selector: 'pagination-container',
  templateUrl: './pagination-container.component.html',
  styleUrls: ['./pagination-container.component.less'],
})
export class PaginationContainerComponent implements OnInit {
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
