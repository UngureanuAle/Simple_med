import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css'],
})
export class ProductDialogComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);
  searchForm: FormGroup;
  displayedColumns = ['cod', 'name', 'manufacturer', 'price'];
  productList: any = [];
  selectedProduct: any = null;
  
  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>
  ) {}
  
  ngOnInit() {
    this.searchForm = this.fb.group({
      cod: '',
      name: '',
      manufacturer: '',
    });

    this.mainApi
      .getProducts(null, null, null, null, null, null)
      .subscribe((data) => {
        this.productList = data;
      });
  }

  searchProducts() {
    this.mainApi
      .getProducts(
        this.searchForm.value.cod,
        this.searchForm.value.name,
        null,
        null,
        this.searchForm.value.manufacturer,
        null
      )
      .subscribe((data) => {
        this.productList = data;
        console.log(this.productList);
      });
  }

  onOk(){
    if( this.selectedProduct )
      this.dialogRef.close(this.selectedProduct.cod);
    else
      this.dialogRef.close();
  }
}
