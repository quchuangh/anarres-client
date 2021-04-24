import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationCfg } from '@shared';

@Component({
  selector: 'ngx-table-pagination',
  template: `
    <nz-pagination
      *ngIf="cfg"
      (nzPageIndexChange)="onPageIndexChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)"
      [nzPageIndex]="pageIndex"
      [nzPageSizeOptions]="cfg.pageSizeOptions"
      [nzPageSize]="pageSize"
      [nzShowQuickJumper]="cfg.showQuickJumper"
      [nzShowSizeChanger]="cfg.showSizeChanger"
      [nzShowTotal]="rangeTemplate"
      [nzSize]="cfg.size"
      [nzTotal]="total"
      class="pagination"
    >
    </nz-pagination>
    <ng-template #rangeTemplate let-range="range" let-total>
      <ng-container *ngIf="total"> {{ range[0] }} - {{ range[1] }} / {{ total }} </ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTablePaginationComponent implements OnInit {
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
