import { HttpClient } from '@angular/common/http';
import {Inject, Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import { ACLService } from '@delon/acl';
import {ALAIN_I18N_TOKEN, App, MenuService, SettingsService, TitleService} from '@delon/theme';
import {AlainConfig, ALAIN_CONFIG} from '@delon/util';
import { TranslateService } from '@ngx-translate/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzIconService } from 'ng-zorro-antd/icon';
import {of, zip} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {I18NService} from '../i18n/i18n.service';

import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private injector: Injector,
    @Inject(ALAIN_CONFIG) private alainCfg: AlainConfig
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  load(): Promise<void> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve) => {
      const users$ = this.httpClient.get(`/api/sys/auth/users`).pipe(
        catchError((res) => {
          return of(null);
        }),
      );

      zip(this.httpClient.get('/api/sys/app-info?_allow_anonymous=true'),
        users$)
        .pipe(
          // 接收其他拦截器后产生的异常消息
          catchError((res) => {
            console.warn(`StartupService.load: Network request failed`, res);
            resolve();
            return [];
          }),
        )
        .subscribe(
          ([appResult, usersResult]) => {
            const users = usersResult as NzSafeAny;

            // Setting language data
            const app: App = appResult as App;

            // Application information: including site name, description, year
            this.settingService.setApp(app);
            // Can be set page suffix title, https://ng-alain.com/theme/title
            if (app.name != null) {
              this.titleService.suffix = app.name;
            }
            if (usersResult) {
              const user = users.user;
              const  menu = users.menu;
              this.translate.use(user.language);

              // Application data
              // User information: including name, avatar, email address
              this.settingService.setUser(user);
              // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
              this.aclService.setFull(true);
              // Menu data, https://ng-alain.com/theme/menu
              this.menuService.add(menu);
            } else {
              setTimeout(() => {

                this.translate.setDefaultLang(this.i18n.defaultLang);
                this.injector.get(Router).navigateByUrl(this.alainCfg.auth?.login_url as string);
              });
            }
          },
          () => {},
          () => {
            resolve();
          },
        );
    });
  }
}
