import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { throwIfAlreadyLoaded } from '@core';
import { ReuseTabMatchMode, ReuseTabService, ReuseTabStrategy } from '@delon/abc/reuse-tab';

// Please refer to: https://ng-alain.com/docs/global-config
// #region NG-ALAIN Config
import { DelonACLModule } from '@delon/acl';
import { DelonMockModule } from '@delon/mock';
import { AlainThemeModule } from '@delon/theme';
import { ALAIN_CONFIG, AlainConfig } from '@delon/util';
// mock
import { environment } from '@env/environment';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import * as MOCKDATA from '../../_mock';

const alainConfig: AlainConfig = {
  st: { modal: { size: 'lg' } },
  pageHeader: { homeI18n: 'home', recursiveBreadcrumb: true },
  auth: {
    login_url: '/passport/login',
    token_send_key: 'Authorization',
  },
  // acl: {
  //   preCan(roleOrAbility: number | number[] | string | string[] | AlainACLType): AlainACLType | null {
  //     if (typeof roleOrAbility === 'string')
  //     const str = roleOrAbility.toString();
  //     return str.startsWith('role:') ? { role: [str] } : { ability: [str] };
  //   }
  // }
};

const alainModules = [AlainThemeModule.forRoot(), DelonACLModule.forRoot(), DelonMockModule.forRoot()];
const alainProvides = [{ provide: ALAIN_CONFIG, useValue: alainConfig }];

if (!environment.production) {
  alainConfig.mock = { data: MOCKDATA };
}

// #region reuse-tab
alainProvides.push({
  provide: RouteReuseStrategy,
  useClass: ReuseTabStrategy,
  deps: [ReuseTabService],
} as any);

// #endregion

// #endregion

// Please refer to: https://ng.ant.design/docs/global-config/en#how-to-use
// #region NG-ZORRO Config

const ngZorroConfig: NzConfig = {};

const zorroProvides = [{ provide: NZ_CONFIG, useValue: ngZorroConfig }];

// #endregion

@NgModule({
  imports: [...alainModules],
})
export class GlobalConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: GlobalConfigModule, reuseTabService: ReuseTabService) {
    throwIfAlreadyLoaded(parentModule, 'GlobalConfigModule');
    // NOTICE: Only valid for menus with reuse property
    // Pls refer to the E-Mail demo effect
    reuseTabService.mode = ReuseTabMatchMode.MenuForce;
    // Shoued be trigger init, you can ignore when used `reuse-tab` component in layout component
    reuseTabService.init();
  }

  static forRoot(): ModuleWithProviders<GlobalConfigModule> {
    return {
      ngModule: GlobalConfigModule,
      providers: [...alainProvides, ...zorroProvides],
    };
  }
}
