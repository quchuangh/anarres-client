import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { RTL, RTLService } from '@delon/theme';
import { combineLatest, fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap, throttleTime } from 'rxjs/operators';

import { BrandService } from '../../pro.service';

@Component({
  selector: 'layout-pro-header',
  templateUrl: './header.component.html',
  host: {
    '[class.ant-layout-header]': 'true',
    '[class.alain-pro__header-fixed]': 'pro.fixedHeader',
    '[class.alain-pro__header-hide]': 'hideHeader',
    '[style.padding.px]': '0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProHeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  hideHeader = false;

  @HostBinding('style.width')
  get getHeadWidth(): string {
    const { isMobile, fixedHeader, menu, collapsed, width, widthInCollapsed } = this.pro;
    if (isMobile || !fixedHeader || menu === 'top') {
      return '100%';
    }
    return collapsed ? `calc(100% - ${widthInCollapsed}px)` : `calc(100% - ${width}px)`;
  }

  get collapsedIcon(): string {
    let type = this.pro.collapsed ? 'unfold' : 'fold';
    if (this.rtl.dir === RTL) {
      type = this.pro.collapsed ? 'fold' : 'unfold';
    }
    return `menu-${type}`;
  }

  constructor(public pro: BrandService, @Inject(DOCUMENT) private doc: any, private cdr: ChangeDetectorRef, private rtl: RTLService) {}

  private handScroll(): void {
    if (!this.pro.autoHideHeader) {
      this.hideHeader = false;
      return;
    }
    setTimeout(() => {
      this.hideHeader = this.doc.body.scrollTop + this.doc.documentElement.scrollTop > this.pro.autoHideHeaderTop;
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.pro.notify.pipe(tap(() => this.cdr.markForCheck())),
      fromEvent(window, 'scroll', { passive: false }).pipe(throttleTime(50), distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.handScroll());

    this.rtl.change.pipe(takeUntil(this.destroy$)).subscribe(() => this.cdr.detectChanges());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
