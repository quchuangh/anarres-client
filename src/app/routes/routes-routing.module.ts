import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// layout
import { LayoutProComponent } from '@brand';
import { environment } from '@env/environment';

const routes: Routes = [
  {
    path: '',
    component: LayoutProComponent,
    children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'pro', loadChildren: () => import('./pro/pro.module').then((m) => m.ProModule) },
      { path: 'sys', loadChildren: () => import('./sys/sys.module').then((m) => m.SysModule) },
      { path: 'ec', loadChildren: () => import('./ec/ec.module').then((m) => m.ECModule) },
      { path: 'map', loadChildren: () => import('./map/map.module').then((m) => m.MapModule) },
      { path: 'chart', loadChildren: () => import('./chart/chart.module').then((m) => m.ChartModule) },
      { path: 'other', loadChildren: () => import('./other/other.module').then((m) => m.OtherModule) },
      { path: 'file', loadChildren: () => import('./file/file.module').then((m) => m.FileModule) },
    ],
  },
  // passport
  { path: '', loadChildren: () => import('./passport/passport.module').then((m) => m.PassportModule) },
  { path: 'exception', loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule) },
  // 单页不包裹Layout
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
