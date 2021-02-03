import {Component, OnInit, TemplateRef} from '@angular/core';
import {ICellRendererAngularComp} from '@ag-grid-community/angular';
import {IAfterGuiAttachedParams, ICellRendererParams} from '@ag-grid-community/core';

@Component({
  selector: 'app-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.scss']
})
export class TemplateRendererComponent implements OnInit, ICellRendererAngularComp {

  template: TemplateRef<any> | undefined;
  templateContext: { $implicit: any, params: any } | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  agInit(params: ICellRendererParams): void {

    // @ts-ignore
    this.template = params.ngTemplate;
    this.refresh(params);
  }


  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.node,
      params
    };
    return true;
  }

}
