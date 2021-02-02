import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardAnalysisComponent } from './analysis/analysis.component';
import { DashboardDDComponent } from './dd/dd.component';
import { DashboardMonitorComponent } from './monitor/monitor.component';
import { DashboardWorkplaceComponent } from './workplace/workplace.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard/analysis', pathMatch: 'full' },
  {
    path: 'dashboard',
    redirectTo: 'dashboard/analysis',
    pathMatch: 'full',
  },
  { path: 'dashboard/analysis', component: DashboardAnalysisComponent },
  { path: 'dashboard/monitor', component: DashboardMonitorComponent },
  { path: 'dashboard/workplace', component: DashboardWorkplaceComponent },
  { path: 'dashboard/dd', component: DashboardDDComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
