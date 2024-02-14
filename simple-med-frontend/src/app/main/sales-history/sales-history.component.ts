import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ClientDialogComponent } from '../client-dialog/client-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SalesHistoryComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);
  dialog = inject(MatDialog);
  router = inject(Router);
  
  searchForm: FormGroup;
  salesList: any = [];
  expandedElement: any = null;
  columnsToDisplay = [ 'created_on', 'cnp', 'total_price', 'operator', 'prescription'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand', 'deleteAction'];

  ngOnInit() {
    this.searchForm = this.fb.group({
      cod: '',
      cnp: '',
      start_date: '',
      end_date: '',
    });

    this.mainApi.getSales(null, null, null, null).subscribe((response) => {
      this.salesList = response;
    });
  }

  searchSales() {
    this.mainApi
      .getSales(
        this.searchForm.value.cod ? this.searchForm.value.cod : null,
        this.searchForm.value.cnp ? this.searchForm.value.cnp : null,
        this.searchForm.value.start_date
          ? this.searchForm.value.start_date
          : null,
        this.searchForm.value.end_date ? this.searchForm.value.end_date : null
      )
      .subscribe((response) => {
        this.salesList = response;
      });
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent);
    dialogRef.afterClosed().subscribe((cod) => {
      if (cod) this.searchForm.controls['cod'].setValue(cod);
    });
  }

  openClientDialog() {
    const dialogRef = this.dialog.open(ClientDialogComponent);
    dialogRef.afterClosed().subscribe((client) => {
      if (client) this.searchForm.controls['cnp'].setValue(client.cnp);
    });
  }

  clearFilters(){
    this.searchForm.reset();
    this.searchSales();
  }

  toggleExpandedRow(element: any): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  deleteSale(row: any){
    this.mainApi.deleteSale( row.id ).subscribe(
      response => {
        this.searchSales();
      }
    )
  }

  openPrescriptionDetails(prescriptionInfo: any){
    this.mainApi.getPrescriptionIdBySN(prescriptionInfo.series, prescriptionInfo.nr).subscribe(
      (data: any) => {
        //this.router.navigate(['/prescriptions', data['prescription_id']]);
        window.open(`/prescriptions/${data['prescription_id']}`);
      }
    )
    
  }
}
