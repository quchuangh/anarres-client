import { INoRowsOverlayAngularComp } from '@ag-grid-community/angular';
import { IAfterGuiAttachedParams, INoRowsOverlayParams } from '@ag-grid-community/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'no-row-overlay',
  templateUrl: './no-row-overlay.component.html',
  styleUrls: ['./no-row-overlay.component.less'],
})
export class NoRowOverlayComponent implements OnInit, INoRowsOverlayAngularComp {
  constructor() {}

  ngOnInit(): void {}
  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: INoRowsOverlayParams): void {}
}
