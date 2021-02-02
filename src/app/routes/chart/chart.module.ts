import { NgModule, Type } from '@angular/core';
import { G2BarModule } from '@delon/chart/bar';
import { G2CardModule } from '@delon/chart/card';
import { G2MiniAreaModule } from '@delon/chart/mini-area';
import { TrendModule as G2TrendModule } from '@delon/chart/trend';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TrendModule } from 'ngx-trend';

import { SharedModule } from '@shared';
import { ChartRoutingModule } from './chart-routing.module';

import { ChartG2Component } from './g2/g2.component';
import { ChartGanttComponent } from './gantt/gantt.component';
import { ChartMermaidComponent } from './mermaid/mermaid.component';
import { ChartNgxChartsAreaComponent } from './ngx-charts/ngx-charts.area.component';
import { ChartNgxChartsBarComponent } from './ngx-charts/ngx-charts.bar.component';
import { ChartNgxChartsComponent } from './ngx-charts/ngx-charts.component';
import { ChartNgxChartsLineComponent } from './ngx-charts/ngx-charts.line.component';
import { ChartNgxChartsNumberCardComponent } from './ngx-charts/ngx-charts.number-card.component';
import { ChartNgxChartsPieComponent } from './ngx-charts/ngx-charts.pie.component';
import { ChartTrendComponent } from './trend/trend.component';

const COMPONENTS: Type<void>[] = [
  ChartG2Component,
  ChartTrendComponent,
  ChartNgxChartsComponent,
  ChartNgxChartsBarComponent,
  ChartNgxChartsPieComponent,
  ChartNgxChartsLineComponent,
  ChartNgxChartsAreaComponent,
  ChartNgxChartsNumberCardComponent,
  ChartMermaidComponent,
  ChartGanttComponent,
];

const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, ChartRoutingModule, TrendModule, G2TrendModule, NgxChartsModule, G2BarModule, G2MiniAreaModule, G2CardModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ChartModule {}
