import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { MainRoutingModule } from './main-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { InventoryOverviewComponent } from './inventory-overview/inventory-overview.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductsOverviewComponent } from './products-overview/products-overview.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { CrudProductsComponent } from './crud-products/crud-products.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {MatDialogModule} from '@angular/material/dialog';
import { BatchOverviewComponent } from './batch-overview/batch-overview.component';
import {MatIconModule} from '@angular/material/icon';
import { ExpandableBatchRowComponent } from './expandable-batch-row/expandable-batch-row.component';
import { CrudBatchesComponent } from './crud-batches/crud-batches.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { SalesCreateComponent } from './sales-create/sales-create.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ClientsOverviewComponent } from './clients-overview/clients-overview.component';
import { CrudClientsComponent } from './crud-clients/crud-clients.component';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { SalesHistoryComponent } from './sales-history/sales-history.component';
import { ExpandableSalesRowComponent } from './expandable-sales-row/expandable-sales-row.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { StatsOverviewComponent } from './stats-overview/stats-overview.component';
import {MatCardModule} from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ConfigOverviewComponent } from './config-overview/config-overview.component';
import { ConfigGeneralCrudComponent } from './config-general-crud/config-general-crud.component';
import { ElectronicReceiptSaleOverviewComponent } from './electronic-receipt-sale-overview/electronic-receipt-sale-overview.component';
import {MatStepperModule} from '@angular/material/stepper';
import { PrescriptionReaderComponent } from './prescription-reader/prescription-reader.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CreatePrescriptionSaleComponent } from './create-prescription-sale/create-prescription-sale.component';
import { ElectronicReceiptsOverviewComponent } from './electronic-receipts-overview/electronic-receipts-overview.component';
import { ElectronicReceiptsDetailsComponent } from './electronic-receipts-details/electronic-receipts-details.component';
import { PrescriptionSummaryComponent } from './prescription-summary/prescription-summary.component';
import { UsersOverviewComponent } from './users-overview/users-overview.component';
import { CrudUsersComponent } from './crud-users/crud-users.component';


@NgModule({
  declarations: [
    MainPageComponent,
    InventoryOverviewComponent,
    ProductsOverviewComponent,
    CrudProductsComponent,
    BatchOverviewComponent,
    ExpandableBatchRowComponent,
    CrudBatchesComponent,
    SalesOverviewComponent,
    SalesCreateComponent,
    ProductDialogComponent,
    ClientsOverviewComponent,
    CrudClientsComponent,
    ClientDialogComponent,
    SalesHistoryComponent,
    ExpandableSalesRowComponent,
    StatsOverviewComponent,
    ConfigOverviewComponent,
    ConfigGeneralCrudComponent,
    ElectronicReceiptSaleOverviewComponent,
    PrescriptionReaderComponent,
    CreatePrescriptionSaleComponent,
    ElectronicReceiptsOverviewComponent,
    ElectronicReceiptsDetailsComponent,
    PrescriptionSummaryComponent,
    UsersOverviewComponent,
    CrudUsersComponent,
    
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MaterialFileInputModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule,
    NgxChartsModule,
    MatStepperModule,
    MatExpansionModule
  ]
})
export class MainModule { }
