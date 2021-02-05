import {Component, OnInit} from '@angular/core';
import {IAfterGuiAttachedParams, IStatusPanelParams,} from '@ag-grid-community/core';
import {IStatusPanelAngularComp} from '@ag-grid-community/angular';

@Component({
  selector: 'app-grid-status-bar',
  templateUrl: './grid-status-bar.component.html',
  styles: []
})
export class GridStatusBarComponent implements OnInit, IStatusPanelAngularComp {
  private params!: IStatusPanelParams;

  constructor() {
  }

  ngOnInit(): void {
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {

  }

  agInit(params: IStatusPanelParams): void {
      this.params = params;
  }


}
