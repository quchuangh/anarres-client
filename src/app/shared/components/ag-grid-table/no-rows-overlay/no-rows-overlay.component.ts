import { INoRowsOverlayAngularComp } from '@ag-grid-community/angular';
import { IAfterGuiAttachedParams, INoRowsOverlayParams } from '@ag-grid-community/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-rows-overlay',
  templateUrl: './no-rows-overlay.component.html',
  styles: [],
})
export class NoRowsOverlayComponent implements INoRowsOverlayAngularComp, OnInit {
  constructor() {}

  ngOnInit(): void {}

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: INoRowsOverlayParams): void {}
}
