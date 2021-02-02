import { Layout, MenuInner } from '@delon/theme';

export type ProLayoutTheme = 'light' | 'dark';
export type ProLayoutMenu = 'side' | 'top';
export type ProLayoutContentWidth = 'fluid' | 'fixed';

export interface ProLayout extends Layout {
  theme: ProLayoutTheme;
  /**
   * menu position
   */
  menu: ProLayoutMenu;
  /**
   * layout of content, only works when menu is top
   */
  contentWidth: ProLayoutContentWidth;
  /**
   * sticky header
   */
  fixedHeader: boolean;
  /**
   * auto hide header
   */
  autoHideHeader: boolean;
  /**
   * sticky siderbar
   */
  fixSiderbar: boolean;
  /**
   * Only icon of menu
   * Limited to a temporary solution [#2183](https://github.com/NG-ZORRO/ng-zorro-antd/issues/2183)
   */
  onlyIcon: boolean;
  /**
   * Color weak
   */
  colorWeak: boolean;
}

export interface ProMenu extends MenuInner {
  _parent?: ProMenu | null;
  children?: ProMenu[];
}
