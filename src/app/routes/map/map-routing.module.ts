import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapBaiduComponent } from './baidu/baidu.component';
import { MapGoogleComponent } from './google/google.component';

const routes: Routes = [
  { path: 'google', component: MapGoogleComponent },
  { path: 'baidu', component: MapBaiduComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
