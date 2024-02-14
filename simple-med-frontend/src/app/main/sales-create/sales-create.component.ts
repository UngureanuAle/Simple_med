import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { MainApiService } from '../main-api.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogComponent } from '../client-dialog/client-dialog.component';

@Component({
  selector: 'app-sales-create',
  templateUrl: './sales-create.component.html',
  styleUrls: ['./sales-create.component.css'],
})
export class SalesCreateComponent {
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  mainApi = inject(MainApiService);
  errMsg: string | null = null;
  errMsgCheckout: string | null = null;
  createSaleForm: FormGroup;
  checkoutForm: FormGroup;
  currentView: 'CHOOSE_TYPE' | 'INITIAL_PHASE' | 'CHECKOUT' | 'FINISHED' | 'ELECTRONIC_RECEIPT' = 'CHOOSE_TYPE';
  selectedClient: any;

  currentProduct: any = {
    name: '',
    price: 0,
    sold_per_unit: false,
    price_per_unit: 0
  };
  displayedColumns = [
    'cod',
    'name',
    'sold_per_unit',
    'price',
    'quantity',
    'totalPrice',
    'deleteAction',
  ];
  itemsList = [];

  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit() {
    this.createSaleForm = this.fb.group({
      cod: '',
      quantity: '1',
      sold_per_unit: false
    });
    this.createSaleForm.get('sold_per_unit').disable();

    this.checkoutForm = this.fb.group({
      clientGroup: this.fb.group({
        clientString: ''
      })
    });


    this.createSaleForm.controls['cod'].valueChanges
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged(), // only emit if the value has changed
        switchMap((cod: string) =>
          this.mainApi.getProductByCode(cod).pipe(
            catchError((error: any) => {
              return 'e';
            })
          )
        )
      )
      .subscribe((data: any) => {
        if (data === 'e') {
          this.errMsg = 'Nu exista niciun produs cu acest cod!';
          this.currentProduct = {
            name: '',
            price: 0,
          };
          this.createSaleForm.get('sold_per_unit').disable();
        } else {
          this.errMsg = null;
          this.currentProduct = {
            id: data.id,
            cod: data.cod,
            name: data.name,
            is_prescribed: data.is_prescribed,
            quantity: this.createSaleForm.value['quantity'],
            price: data.price,
            sold_per_unit: data.sold_per_unit,
            price_per_unit: data.price_per_unit,
          };

          if( this.currentProduct.sold_per_unit )
            this.createSaleForm.get('sold_per_unit').enable();
          else{
            this.createSaleForm.get('sold_per_unit').disable();
            this.createSaleForm.controls['sold_per_uniut'].setValue(false);
          }
            
        }
      });

    this.createSaleForm.controls['quantity'].valueChanges.subscribe((value) => {
      if (parseInt(value) <= 0)
        this.createSaleForm.controls['quantity'].setValue(1);
    });
  }

  onAdd() {
    const temp = Object.assign({}, this.currentProduct);
    temp.sold_per_unit = this.createSaleForm.value.sold_per_unit ? this.createSaleForm.value.sold_per_unit : false;
    temp.quantity = this.createSaleForm.value['quantity'];
    this.itemsList.push(temp);
    this.table.renderRows();
  }

  getItemsTotalPrice() {
    let total = 0;
    this.itemsList.forEach((item) => {
      if( item.sold_per_unit )
        total += item.price_per_unit * item.quantity;
      else
        total += item.price * item.quantity;
    });
    return total;
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent);
    dialogRef.afterClosed().subscribe((cod) => {
      if (cod) this.createSaleForm.controls['cod'].setValue(cod);
    });
  }

  deleteItem(item: any) {
    const index = this.itemsList.indexOf(item);
    this.itemsList.splice(index, 1);
    this.table.renderRows();
  }

  openClientDialog() {
    const dialogRef = this.dialog.open(ClientDialogComponent);
    dialogRef.afterClosed().subscribe(
      (data) => {
        this.selectedClient = data;
      }
    )
    
  }

  private checkForPrescribedItems(): boolean{
    let sw: boolean = false;
    this.itemsList.forEach( item => {
      if( item.is_prescribed )
        sw = true;
    });

    return sw;
  }

  checkout(){
    this.errMsgCheckout = null;
    if( this.checkForPrescribedItems()){
      this.errMsgCheckout = 'Dacă vindeți produse care necesită prescripția este necesar să eliberati o reteta electronica!';
      return;
    }
    
    let clientId = null;
    if (this.selectedClient)
      clientId = this.selectedClient.id ? this.selectedClient.id : null;
    
    this.mainApi.createSale(clientId, this.itemsList).subscribe(
      (response) => {
        this.currentView = 'FINISHED';
        this.itemsList = [];
      },
      (err) => {
        this.errMsgCheckout = err;
      }
    )
    
  }

  getCurrentPrice(){
    if( !this.currentProduct.sold_per_unit )
      return this.currentProduct.price;
    else {
      if (this.createSaleForm){
        if (this.createSaleForm.value.sold_per_unit)
          return this.currentProduct.price_per_unit;
        else
          return this.currentProduct.price;
      }
      else
        return this.currentProduct.price;

    }
  }
}
