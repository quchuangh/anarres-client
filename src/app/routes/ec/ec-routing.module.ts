import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ECTradeComponent } from './trade/list.component';
import { ECWareEditComponent } from './ware/edit/edit.component';
import { ECWareComponent } from './ware/list.component';
import { ECWareViewComponent } from './ware/view/view.component';

const routes: Routes = [
  { path: 'ware', component: ECWareComponent },
  { path: 'ware/:id', component: ECWareViewComponent },
  { path: 'ware/edit/:id', component: ECWareEditComponent },
  { path: 'trade', component: ECTradeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ECRoutingModule {}
