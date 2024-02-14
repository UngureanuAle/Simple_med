import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductDisplay } from '../interfaces/Product';
import { MainApiService } from '../main-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-overview',
  templateUrl: './products-overview.component.html',
  styleUrls: ['./products-overview.component.css']
})
export class ProductsOverviewComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);
  searchForm: FormGroup;
  nextOperation: 'INSERT' | 'UPDATE' = 'UPDATE';
  displayedColumns: string[] = ['cod', 'name', 'manufacturer', 'price', 'med_type', 'adm_type', 'is_prescribed', 'insertAction'];
  product_list: ProductDisplay[] = [];
  currentView: 'OVERVIEW' | 'DETAILS' = 'OVERVIEW';
  currentProduct: ProductDisplay | undefined;

  fetchProducts(){
    const cod = (this.searchForm.value.cod ? this.searchForm.value.cod : null);
    const name = (this.searchForm.value.name ? this.searchForm.value.name : null);
    const medType = (this.searchForm.value.med_type ? this.searchForm.value.med_type : null);
    const admType = (this.searchForm.value.adm_type ? this.searchForm.value.adm_type : null);
    const manufacturer = (this.searchForm.value.manufacturer ? this.searchForm.value.manufacturer : null);
    const is_prescribed = (this.searchForm.value.is_prescribed ? this.searchForm.value.is_prescribed : null)

    this.mainApi.getProducts(cod, name, medType, admType, manufacturer, is_prescribed).subscribe(
      (response) => {
        console.log(response);
        this.product_list = response as ProductDisplay[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  clearFilters(){
    this.searchForm.reset();
    this.fetchProducts();
  }

  openEditPage(operation: 'INSERT' | 'UPDATE', row: any | null){

    if( operation === 'UPDATE' && row ){
      this.nextOperation = 'UPDATE';
      this.mainApi.getProduct(row.id).subscribe(
        (response) => {
          console.log(response);
          const temp = response as ProductDisplay;
          delete temp.adm_type_display;
          delete temp.med_type_display;
          this.currentProduct = temp;
          this.toggleBetweenViews();
        }
      );
    }
    else if( operation === 'INSERT' && !row){
      this.nextOperation = 'INSERT';
      this.currentProduct = undefined;
      this.toggleBetweenViews();
    }
  }


  ngOnInit(){
    this.searchForm = this.fb.group({
      cod: '',
      name: '',
      is_prescribed: '',
      manufacturer: '',
      med_type: '',
      adm_type: '',
    });

    this.fetchProducts();
    
  }

  toggleBetweenViews(){
    if (this.currentView === 'OVERVIEW') this.currentView = 'DETAILS';
    else if (this.currentView === 'DETAILS'){
      this.currentView = 'OVERVIEW'
      this.fetchProducts();
    } ;
  }


}
