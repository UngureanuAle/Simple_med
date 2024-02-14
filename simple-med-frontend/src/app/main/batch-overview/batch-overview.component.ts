import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-batch-overview',
  templateUrl: './batch-overview.component.html',
  styleUrls: ['./batch-overview.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BatchOverviewComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);

  searchForm: FormGroup;
  nextOperation: 'INSERT' | 'UPDATE' = 'UPDATE';
  currentView: 'DETAILS' | 'OVERVIEW' = 'OVERVIEW';
  columnsToDisplay = [ 'codProduct', 'nameProduct', 'totalInitial', 'totalCurrent', 'openedBox', 'leftInBox'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any = null;
  batch_list: any = []
  currentBatch: any;

  ngOnInit(){
    
    this.searchForm = this.fb.group({
      cod: '',
      name: '',
    });
    this.fetchBatches();
  }

  toggleBetweenViews(){
    if (this.currentView === 'OVERVIEW') this.currentView = 'DETAILS';
    else if (this.currentView === 'DETAILS'){
      this.currentView = 'OVERVIEW'
      //this.fetchBatches();
    } ;
  }

  fetchBatches(){
    //console.log(this.searchForm.value.cod ? this.searchForm.value.cod : null);
    this.mainApi.getBatches(
      this.searchForm.value.cod ? this.searchForm.value.cod : null,
      this.searchForm.value.name ? this.searchForm.value.name : null,
    ).subscribe(
      (response) => {
        //console.log(response);
        this.batch_list = response;
      },
      (error) => {
        //console.log(error);
      }
    );
  }

  clearFilters(){
    this.searchForm.reset();
    this.fetchBatches();
  }

  toggleExpandedRow(element: any): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  isExpiring(batches: any){
    const currentDate = new Date();
    
    //console.log(batches);

    let sw = 0;
    if(batches.length > 0){
      batches.every((batch: any) => {
        const expiryDate = new Date(batch.expiring_date);
        //window.alert(expiryDate);
        if( currentDate >= expiryDate ){
          sw = -1;
          return false;
        }
        
        const sevenDaysBefore = new Date();
        sevenDaysBefore.setDate(expiryDate.getDate() - 7);
        sevenDaysBefore.setMonth(expiryDate.getMonth());
        sevenDaysBefore.setFullYear(expiryDate.getFullYear());

        if( currentDate >= sevenDaysBefore && currentDate < expiryDate){
          sw = -2;
        }

        return true;
          
      });
    } 

    return sw;  
  }


  mapBatchData(data: any){
    const ret = [];
    const productId = data.product.id;
    data.batches.forEach( batch => {
      const current = Object.assign({}, batch);
      current.product_id = productId;
      ret.push(current);
    });

    //console.log(ret.toString());
    return ret;
  }

  openEditPage(operation: 'INSERT' | 'UPDATE', row: any | null){

    if( operation === 'UPDATE' && row ){
      this.nextOperation = 'UPDATE';
      this.currentBatch = row;
      this.toggleBetweenViews();
    }
    else if( operation === 'INSERT' && row){
      this.nextOperation = 'INSERT';
      this.currentBatch = {product_id: row};
      this.toggleBetweenViews();
    }
      
        
  }
}
