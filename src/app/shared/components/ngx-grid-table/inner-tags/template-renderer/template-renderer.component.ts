import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from '@ag-grid-community/core';
import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.less'],
})
export class TemplateRendererComponent implements OnInit, ICellRendererAngularComp {
  template!: TemplateRef<any>;
  templateContext!: { $implicit: ICellRendererParams; row: RowNode };

  constructor() {}

  ngOnInit(): void {}

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: ICellRendererParams): void {
    // @ts-ignore
    this.template = params.ngTemplate;
    this.refresh(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.templateContext = {
      $implicit: params,
      row: params.node,
    };
    return true;
  }
}
