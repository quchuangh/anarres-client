import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChartG2Component } from './g2/g2.component';
import { ChartGanttComponent } from './gantt/gantt.component';
import { ChartMermaidComponent } from './mermaid/mermaid.component';
import { ChartNgxChartsComponent } from './ngx-charts/ngx-charts.component';
import { ChartTrendComponent } from './trend/trend.component';

const routes: Routes = [
  { path: 'g2', component: ChartG2Component },
  { path: 'ngx-trend', component: ChartTrendComponent },
  { path: 'ngx-charts', component: ChartNgxChartsComponent },
  { path: 'mermaid', component: ChartMermaidComponent },
  { path: 'gantt', component: ChartGanttComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartRoutingModule {}
