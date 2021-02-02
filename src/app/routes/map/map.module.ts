import { AgmCoreModule } from '@agm/core';
import { NgModule, Type } from '@angular/core';
import { AbmModule } from 'angular-baidu-maps';

import { SharedModule } from '@shared';
import { MapRoutingModule } from './map-routing.module';

import { MapBaiduComponent } from './baidu/baidu.component';
import { MapGoogleComponent } from './google/google.component';

const COMPONENTS: Type<void>[] = [MapGoogleComponent, MapBaiduComponent];

const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    MapRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyALxb-cRGW21h96bc4iPLt15EvmI7fVw8I',
    }),
    AbmModule.forRoot({ apiKey: '8oZDc2QBZSbjNpoC42cd5jGVa3GknG1c' }),
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class MapModule {}
