import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
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
  @Input() right: Array<Actions> = [];

  @Input() page!: TemplateRef<any>;
  @Input() showCenter = false;
  @Input() table!: NgxGridTableComponent;

  @ContentChild('center-panel') centerPanel!: TemplateRef<any>;

  loading!: Observable<boolean>;
  full = false;

  constructor() {}

  ngOnInit(): void {
    this.loading = this.table.dataLoadingChange.asObservable();
    this.full = this.table.fullscreen;
  }

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
