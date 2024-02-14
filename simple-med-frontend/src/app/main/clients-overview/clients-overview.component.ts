import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';

@Component({
  selector: 'app-clients-overview',
  templateUrl: './clients-overview.component.html',
  styleUrls: ['./clients-overview.component.css']
})
export class ClientsOverviewComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);

  currentView: 'OVERVIEW' | 'DETAILS' = 'OVERVIEW';
  nextOperation: 'INSERT' | 'UPDATE' = 'UPDATE';

  searchForm: FormGroup;
  clientsList: any = [];
  displayedColumns = ['cnp', 'last_name', 'first_name', 'insertAction'];
  currentClient: any;

  ngOnInit(){
    this.searchForm = this.fb.group({
      cnp: '',
      first_name: '',
      last_name: ''
    });

    this.fetchClients();
  }

  fetchClients(){
    const cnp = (this.searchForm.value.cnp ? this.searchForm.value.cnp : null);
    const last_name = (this.searchForm.value.last_name ? this.searchForm.value.last_name : null);
    const first_name = (this.searchForm.value.first_name ? this.searchForm.value.first_name : null);

    this.mainApi.getClients(
      cnp,
      last_name,
      first_name
    ).subscribe(
      (data: any) => {
        this.clientsList = data;
      }
    )
  }

  clearFilters(){
    this.searchForm.reset();
  }

  toggleBetweenViews(){
    if (this.currentView === 'OVERVIEW') this.currentView = 'DETAILS';
    else if (this.currentView === 'DETAILS'){
      this.currentView = 'OVERVIEW'
      this.fetchClients();
    } ;
  }

  openEditPage(operation: 'INSERT' | 'UPDATE', row: any | null){

    if( operation === 'UPDATE' && row ){
      this.nextOperation = 'UPDATE';
      this.mainApi.getClient(row.cnp).subscribe(
        (response) => {
          this.currentClient = response;
          this.toggleBetweenViews();
        }
      );
    }
    else if( operation === 'INSERT' && !row){
      this.nextOperation = 'INSERT';
      this.currentClient = undefined;
      this.toggleBetweenViews();
    }
  }
}
