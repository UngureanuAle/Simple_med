import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-electronic-receipts-overview',
  templateUrl: './electronic-receipts-overview.component.html',
  styleUrls: ['./electronic-receipts-overview.component.css']
})
export class ElectronicReceiptsOverviewComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);
  router = inject(Router);

  currentView: 'OVERVIEW' | 'DETAILS' = 'OVERVIEW';
  searchForm: FormGroup;
  displayedColumns = ['series', 'nr', 'stencil_nr', 'cnp'];
  prescriptionsList: any = [];

  ngOnInit(){
    this.searchForm = this.fb.group({
      series: '',
      nr: '',
      stencil_nr: '',
      cnp: ''
    })

    this.getPrescriptions();
  }

  getPrescriptions(){
    this.mainApi.getPrescriptionsList(
      this.searchForm.value['series'] ? this.searchForm.value['series'] : null,
      this.searchForm.value['nr'] ? this.searchForm.value['nr'] : null,
      this.searchForm.value['stencil_nr'] ? this.searchForm.value['stencil_nr'] : null,
      this.searchForm.value['cnp'] ? this.searchForm.value['cnp'] : null,
    ).subscribe(
      data => {
        this.prescriptionsList = data;
      }
    )
  }

  resetFilters(){
    this.searchForm.reset();
    this.getPrescriptions();
  }

  openDetailsPage(id: string){
    this.router.navigate(['/prescriptions', id]);
  }
}
