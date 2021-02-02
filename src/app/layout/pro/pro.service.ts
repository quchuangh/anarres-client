import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Layout, SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProLayout, ProLayoutContentWidth, ProLayoutMenu, ProLayoutTheme } from './pro.types';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private notify$ = new BehaviorSubject<string | null>(null);
  private _isMobile = false;

  // #region fields

  get notify(): Observable<string | null> {
    return this.notify$.asObservable();
  }

  /**
   * Specify width of the sidebar, If you change it, muse be synchronize change less parameter:
   * ```less
   * @alain-pro-sider-menu-width: 256px;
   * ```
   */
  readonly width = 256;

  /**
   * Specify width of the sidebar after collapsed, If you change it, muse be synchronize change less parameter:
   * ```less
   * @menu-collapsed-width: 80px;
   * ```
   */
  readonly widthInCollapsed = 80;

  /**
   * Specify height of the header, If you change it, muse be synchronize change less parameter:
   * ```less
   * @alain-pro-header-height: 64px;
   * ```
   */
  readonly headerHeight = 64;

  /**
   * Specify distance from top for automatically hidden header
   */
  readonly autoHideHeaderTop = 300;

  get isMobile(): boolean {
    return this._isMobile;
  }

  get layout(): ProLayout {
    return this.settings.layout as ProLayout;
  }

  get collapsed(): boolean {
    return this.layout.collapsed;
  }

  get theme(): ProLayoutTheme {
    return this.layout.theme;
  }

  get menu(): ProLayoutMenu {
    return this.layout.menu;
  }

  get contentWidth(): ProLayoutContentWidth {
    return this.layout.contentWidth;
  }

  get fixedHeader(): boolean {
    return this.layout.fixedHeader;
  }

  get autoHideHeader(): boolean {
    return this.layout.autoHideHeader;
  }

  get fixSiderbar(): boolean {
    return this.layout.fixSiderbar;
  }

  get onlyIcon(): boolean {
    return this.menu === 'side' ? false : this.layout.onlyIcon;
  }

  /** Whether the top menu */
  get isTopMenu(): boolean {
    return this.menu === 'top' && !this.isMobile;
  }

  /** Whether the side menu */
  get isSideMenu(): boolean {
    return this.menu === 'side' && !this.isMobile;
  }

  /** Whether the fixed content */
  get isFixed(): boolean {
    return this.contentWidth === 'fixed';
  }

  // #endregion

  constructor(bm: BreakpointObserver, private settings: SettingsService) {
    // fix layout data
    settings.setLayout({
      theme: 'dark',
      menu: 'side',
      contentWidth: 'fluid',
      fixedHeader: false,
      autoHideHeader: false,
      fixSiderbar: false,
      onlyIcon: true,
      ...(environment as any).pro,
      ...settings.layout, // Browser cache
    });

    const mobileMedia = 'only screen and (max-width: 767.99px)';
    bm.observe(mobileMedia).subscribe((state) => this.checkMedia(state.matches));
    this.checkMedia(bm.isMatched(mobileMedia));
  }

  private checkMedia(value: boolean): void {
    this._isMobile = value;
    this.layout.collapsed = this._isMobile;
    this.notify$.next('mobile');
  }

  setLayout(name: string | Layout, value?: any): void {
    this.settings.setLayout(name, value);
    this.notify$.next('layout');
  }

  setCollapsed(status?: boolean): void {
    this.setLayout('collapsed', typeof status !== 'undefined' ? status : !this.collapsed);
  }
}
