// #region exports

export * from './pro.types';
export * from './pro.service';
export * from './pro.component';

// #endregion

// #region widgets

import { LayoutProWidgetNotifyComponent } from './components/notify/notify.component';
import { LayoutProWidgetQuickChatStatusComponent } from './components/quick-chat/quick-chat-status.component';
import { LayoutProWidgetQuickChatComponent } from './components/quick-chat/quick-chat.component';
import { LayoutProWidgetQuickComponent } from './components/quick/quick.component';
import { LayoutProWidgetRTLComponent } from './components/rtl/rtl.component';
import { LayoutProWidgetSearchComponent } from './components/search/search.component';
import { LayoutProWidgetUserComponent } from './components/user/user.component';
import { LayoutProHeaderWidgetComponent } from './components/widget/widget.component';

const PRO_WIDGETS = [
  LayoutProHeaderWidgetComponent,
  LayoutProWidgetNotifyComponent,
  LayoutProWidgetSearchComponent,
  LayoutProWidgetUserComponent,
  LayoutProWidgetQuickComponent,
  LayoutProWidgetQuickChatComponent,
  LayoutProWidgetQuickChatStatusComponent,
  LayoutProWidgetRTLComponent,
];

// #endregion

// #region entry components

import { LayoutProWidgetQuickPanelComponent } from './components/quick/quick-panel.component';
import { ProSettingDrawerComponent } from './setting-drawer/setting-drawer.component';

export const PRO_ENTRYCOMPONENTS = [ProSettingDrawerComponent, LayoutProWidgetQuickPanelComponent];

// #endregion

// #region components

import { LayoutProFooterComponent } from './components/footer/footer.component';
import { LayoutProHeaderComponent } from './components/header/header.component';
import { LayoutProLogoComponent } from './components/logo/logo.component';
import { LayoutProMenuComponent } from './components/menu/menu.component';
import { LayoutProComponent } from './pro.component';

export const PRO_COMPONENTS = [
  LayoutProComponent,
  LayoutProMenuComponent,
  LayoutProLogoComponent,
  LayoutProHeaderComponent,
  LayoutProFooterComponent,
  ...PRO_ENTRYCOMPONENTS,
  ...PRO_WIDGETS,
];

// #endregion

// #region shared components

import { ProPageModule } from './shared/page';
export const PRO_SHARED_MODULES = [ProPageModule];

// #endregion
