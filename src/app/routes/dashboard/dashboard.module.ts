import { NgModule } from '@angular/core';
import { CountDownModule } from '@delon/abc/count-down';
import { G2BarModule } from '@delon/chart/bar';
import { G2CardModule } from '@delon/chart/card';
import { G2GaugeModule } from '@delon/chart/gauge';
import { G2MiniAreaModule } from '@delon/chart/mini-area';
import { G2MiniBarModule } from '@delon/chart/mini-bar';
import { G2MiniProgressModule } from '@delon/chart/mini-progress';
import { NumberInfoModule } from '@delon/chart/number-info';
import { G2PieModule } from '@delon/chart/pie';
import { G2RadarModule } from '@delon/chart/radar';
import { G2SingleBarModule } from '@delon/chart/single-bar';
import { G2TagCloudModule } from '@delon/chart/tag-cloud';
import { G2TimelineModule } from '@delon/chart/timeline';
import { TrendModule } from '@delon/chart/trend';
import { G2WaterWaveModule } from '@delon/chart/water-wave';
import { SharedModule } from '@shared';
import { CountdownModule } from 'ngx-countdown';

import { DashboardAnalysisComponent } from './analysis/analysis.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardDDComponent } from './dd/dd.component';
import { DashboardDDWidgets } from './dd/index';
import { DashboardMonitorComponent } from './monitor/monitor.component';
import { DashboardWorkplaceComponent } from './workplace/workplace.component';

const COMPONENTS = [
  DashboardAnalysisComponent,
  DashboardDDComponent,
  ...DashboardDDWidgets,
  DashboardMonitorComponent,
  DashboardWorkplaceComponent,
];

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    CountDownModule,
    CountdownModule,
    G2BarModule,
    G2CardModule,
    G2GaugeModule,
    G2MiniAreaModule,
    G2MiniBarModule,
    G2MiniProgressModule,
    G2PieModule,
    G2RadarModule,
    G2SingleBarModule,
    G2TagCloudModule,
    G2TimelineModule,
    G2WaterWaveModule,
    NumberInfoModule,
    TrendModule,
  ],
  declarations: [...COMPONENTS],
})
export class DashboardModule {}
