import { ILoadingOverlayAngularComp } from '@ag-grid-community/angular';
import { IAfterGuiAttachedParams, ILoadingOverlayParams } from '@ag-grid-community/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'grid-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent implements OnInit, ILoadingOverlayAngularComp {
  constructor() {}

  ngOnInit(): void {}

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  agInit(params: ILoadingOverlayParams): void {}
}
