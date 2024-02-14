import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MainApiService } from '../main-api.service';

@Component({
  selector: 'app-client-dialog',
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.css']
})
export class ClientDialogComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);
  searchForm: FormGroup;
  displayedColumns = ['cnp', 'last_name', 'first_name'];
  clientList: any = [];
  selectedClient: any = null;

  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>
  ) {}
  
  ngOnInit(){
    this.searchForm = this.fb.group({
      cnp: '',
      first_name: '',
      last_name: '',
    });

    this.mainApi.getClients(
      null,
      null,
      null
    ).subscribe(
      (response) => {
        this.clientList = response;
      }
    )
  }

  onOk(){
    if( this.selectedClient )
      this.dialogRef.close(this.selectedClient);
    else
      this.dialogRef.close();
  }

  searchClients() {
    this.mainApi
      .getClients(
        this.searchForm.value.cnp,
        this.searchForm.value.last_name,
        this.searchForm.value.first_name,
      )
      .subscribe((data) => {
        this.clientList = data;
      });
  }

}
