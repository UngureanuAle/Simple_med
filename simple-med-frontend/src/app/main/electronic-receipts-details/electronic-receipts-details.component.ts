import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainApiService } from '../main-api.service';

@Component({
  selector: 'app-electronic-receipts-details',
  templateUrl: './electronic-receipts-details.component.html',
  styleUrls: ['./electronic-receipts-details.component.css']
})
export class ElectronicReceiptsDetailsComponent {
  route = inject(ActivatedRoute);
  mainApi = inject(MainApiService);

  prescriptionId: string;
  prescriptionData: any;
  notFound = false;

  constructor(){
    this.route.params.subscribe(params => {
      this.prescriptionId = params['id'];
      this.mainApi.getPrescriptionsById(this.prescriptionId).subscribe(
        data => {
          this.notFound = false;
          this.prescriptionData = data;
          console.log(data);
        },
        err => {
          this.notFound = true;
          this.prescriptionData = undefined;
        }
      )
    });

  }
}
