import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { RTL, RTLService, ScrollService } from '@delon/theme';
import { updateHostClass } from '@delon/util';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BrandService } from './pro.service';
import { ProSettingDrawerComponent } from './setting-drawer/setting-drawer.component';

@Component({
  selector: 'layout-pro',
  templateUrl: './pro.component.html',
  // NOTICE: If all pages using OnPush mode, you can turn it on and all `cdr.detectChanges()` codes
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private queryCls?: string;
  @ViewChild('settingHost', { read: ViewContainerRef, static: false }) private settingHost!: ViewContainerRef;

  isFetching = false;

  get isMobile(): boolean {
    return this.pro.isMobile;
  }

  get getLayoutStyle(): { [key: string]: string } | null {
    const { isMobile, fixSiderbar, collapsed, menu, width, widthInCollapsed } = this.pro;
    if (fixSiderbar && menu !== 'top' && !isMobile) {
      return {
        [this.rtl.dir === RTL ? 'paddingRight' : 'paddingLeft']: (collapsed ? widthInCollapsed : width) + 'px',
      };
    }
    return null;
  }

  get getContentStyle(): { [key: string]: string } {
    const { fixedHeader, headerHeight } = this.pro;
    return {
      margin: '24px 24px 0',
      'padding-top': (fixedHeader ? headerHeight : 0) + 'px',
    };
  }

  private get body(): HTMLElement {
    return this.doc.body;
  }

  constructor(
    bm: BreakpointObserver,
    mediaMatcher: MediaMatcher,
    router: Router,
    msg: NzMessageService,
    scroll: ScrollService,
    reuseTabSrv: ReuseTabService,
    private resolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    public pro: BrandService,
    @Inject(DOCUMENT) private doc: any,
    // private cdr: ChangeDetectorRef
    private rtl: RTLService,
  ) {
    // scroll to top in change page
    router.events.pipe(takeUntil(this.destroy$)).subscribe((evt) => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
        scroll.scrollToTop();
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false;
        msg.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.isFetching = false;
      // If have already cached router, should be don't need scroll to top
      if (!reuseTabSrv.exists(evt.url)) {
        scroll.scrollToTop();
      }
    });

    // media
    const query: { [key: string]: string } = {
      'screen-xs': '(max-width: 575px)',
      'screen-sm': '(min-width: 576px) and (max-width: 767px)',
      'screen-md': '(min-width: 768px) and (max-width: 991px)',
      'screen-lg': '(min-width: 992px) and (max-width: 1199px)',
      'screen-xl': '(min-width: 1200px)',
    };
    bm.observe([
      '(min-width: 1200px)',
      '(min-width: 992px) and (max-width: 1199px)',
      '(min-width: 768px) and (max-width: 991px)',
      '(min-width: 576px) and (max-width: 767px)',
      '(max-width: 575px)',
    ]).subscribe(() => {
      this.queryCls = Object.keys(query).find((key) => mediaMatcher.matchMedia(query[key]).matches);
      this.setClass();
    });
  }

  private setClass(): void {
    const { body, renderer, queryCls, pro } = this;
    updateHostClass(body, renderer, {
      ['color-weak']: pro.layout.colorWeak,
      [`layout-fixed`]: pro.layout.fixed,
      [`aside-collapsed`]: pro.collapsed,
      ['alain-pro']: true,
      [queryCls!]: true,
      [`alain-pro__content-${pro.layout.contentWidth}`]: true,
      [`alain-pro__fixed`]: pro.layout.fixedHeader,
      [`alain-pro__wide`]: pro.isFixed,
      [`alain-pro__dark`]: pro.theme === 'dark',
      [`alain-pro__light`]: pro.theme === 'light',
      [`alain-pro__menu-side`]: pro.isSideMenu,
      [`alain-pro__menu-top`]: pro.isTopMenu,
    });
  }

  ngAfterViewInit(): void {
    // Setting componet for only developer
    if (!environment.production) {
      setTimeout(() => {
        const settingFactory = this.resolver.resolveComponentFactory(ProSettingDrawerComponent);
        this.settingHost.createComponent(settingFactory);
      }, 22);
    }
  }

  ngOnInit(): void {
    const { pro, destroy$ } = this;
    pro.notify.pipe(takeUntil(destroy$)).subscribe(() => {
      this.setClass();
    });
  }

  ngOnDestroy(): void {
    const { destroy$, body, pro } = this;
    destroy$.next();
    destroy$.complete();
    body.classList.remove(
      `alain-pro__content-${pro.layout.contentWidth}`,
      `alain-pro__fixed`,
      `alain-pro__wide`,
      `alain-pro__dark`,
      `alain-pro__light`,
    );
  }
}
