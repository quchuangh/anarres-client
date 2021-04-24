import { INoRowsOverlayAngularComp } from '@ag-grid-community/angular';
import { IAfterGuiAttachedParams, INoRowsOverlayParams } from '@ag-grid-community/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'no-row-overlay',
  template: '<nz-empty></nz-empty>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoRowOverlayComponent implements OnInit, INoRowsOverlayAngularComp {
  constructor() {}

  ngOnInit(): void {}
  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: INoRowsOverlayParams): void {}
}
