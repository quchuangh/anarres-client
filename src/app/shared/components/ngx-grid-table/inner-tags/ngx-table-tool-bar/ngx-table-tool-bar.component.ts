import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxGridTableComponent } from '../../table/ngx-grid-table.component';

export type Actions = 'search' | 'reset' | 'data-mode' | 'full' | 'export' | 'page';
@Component({
  selector: 'ngx-table-tool-bar',
  templateUrl: 'ngx-table-tool-bar.component.html',
  styleUrls: ['ngx-table-tool-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTableToolBarComponent implements OnInit {
  @Input() left: Array<Actions> = [];
  @Input() center: Array<Actions> = [];
  @Input() right: Array<Actions> = ['page'];

  @Input() page!: TemplateRef<any>;
  @Input() showCenter = false;

  loading: Observable<boolean>;
  full = false;

  constructor(@Optional() public table: NgxGridTableComponent) {
    this.loading = table.dataLoadingChange.asObservable();
    this.full = table.fullscreen;
  }

  ngOnInit(): void {}

  onSearch(): void {
    this.table.refresh();
  }

  onReset(): void {
    this.table.resetForm();
  }

  onDataMode(): void {
    this.table.toggleDataModel();
  }

  onFull(): void {
    this.table.toggleFullscreen();
    this.full = this.table.fullscreen;
  }

  onExport(): void {
    this.table.exportAllPageData();
  }
}
