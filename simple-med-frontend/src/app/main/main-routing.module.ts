import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MainPageComponent } from '../main/main-page/main-page.component';
import { InventoryOverviewComponent } from './inventory-overview/inventory-overview.component';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { ClientsOverviewComponent } from './clients-overview/clients-overview.component';
import { ConfigOverviewComponent } from './config-overview/config-overview.component';
import { ElectronicReceiptsOverviewComponent } from './electronic-receipts-overview/electronic-receipts-overview.component';
import { ElectronicReceiptsDetailsComponent } from './electronic-receipts-details/electronic-receipts-details.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inventory', pathMatch: 'full' },
      { path: 'inventory', component: InventoryOverviewComponent },
      { path: 'sales', component: SalesOverviewComponent },
      { path: 'clients', component: ClientsOverviewComponent },
      { path: 'configs', component:  ConfigOverviewComponent},
      { path: 'prescriptions', component: ElectronicReceiptsOverviewComponent },
      { path: 'prescriptions/:id', component: ElectronicReceiptsDetailsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
