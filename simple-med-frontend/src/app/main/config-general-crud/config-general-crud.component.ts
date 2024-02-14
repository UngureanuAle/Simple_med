import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';

@Component({
  selector: 'app-config-general-crud',
  templateUrl: './config-general-crud.component.html',
  styleUrls: ['./config-general-crud.component.css']
})
export class ConfigGeneralCrudComponent {
  mainApi = inject(MainApiService);
  fb = inject(FormBuilder);
  generalConfigForm: FormGroup;
  
  isEditing: boolean = false;
  currentConfigs: any = undefined;
  editableConfigs: any = undefined;


  ngOnInit(){
    this.generalConfigForm = this.fb.group({
      pharmacyName: {
        value: '',
        disabled: !this.isEditing,
      },
      pharmacyCode: {
        value: '',
        disabled: !this.isEditing,
      },
      pharmacyLocation: {
        value: '',
        disabled: !this.isEditing,
      },
      insuranceHouse: {
        value: '',
        disabled: !this.isEditing,
      },
      insuranceHouseContractNo: {
        value: '',
        disabled: !this.isEditing,
      }
    });

    this.mainApi.getConfigs().subscribe(
      data => {
        this.generalConfigForm.controls['pharmacyName'].setValue( data['pharmacy_name'] );
        this.generalConfigForm.controls['pharmacyCode'].setValue( data['pharmacy_cod'] );
        this.generalConfigForm.controls['pharmacyLocation'].setValue( data['pharmacy_location'] );
        this.generalConfigForm.controls['insuranceHouse'].setValue( data['insurance_house'] );
        this.generalConfigForm.controls['insuranceHouseContractNo'].setValue( data['insurance_contract_no'] );
        this.currentConfigs = data;
      }
    )

  }

  toggleEditMode(value: boolean){
    this.isEditing = value;
    this.updateControlStatusRecursive(this.generalConfigForm, this.isEditing);

    if (!value)
      this.resetEditableForm();
  }

  private resetEditableForm(){
    this.generalConfigForm.controls['pharmacyName'].setValue( this.currentConfigs['pharmacy_name'] );
    this.generalConfigForm.controls['pharmacyCode'].setValue( this.currentConfigs['pharmacy_cod'] );
    this.generalConfigForm.controls['pharmacyLocation'].setValue( this.currentConfigs['pharmacy_location'] );
    this.generalConfigForm.controls['insuranceHouse'].setValue( this.currentConfigs['insurance_house'] );
    this.generalConfigForm.controls['insuranceHouseContractNo'].setValue( this.currentConfigs['insurance_contract_no'] );
    this.editableConfigs = this.currentConfigs;
  }

  private updateControlStatusRecursive(
    formGroup: FormGroup,
    isEditing: boolean
  ) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key)!; // Use the non-null assertion operator here
      if (control instanceof FormGroup) {
        this.updateControlStatusRecursive(control, isEditing);
      } else {
        if (isEditing) {
          control.enable();
        } else {
          control.disable();
        }
      }
    });
  }

  onOk(){
    this.editableConfigs = {};
    this.editableConfigs['pharmacy_name'] = this.generalConfigForm.value['pharmacyName'];
    this.editableConfigs['pharmacy_cod'] = this.generalConfigForm.value['pharmacyCode'];
    this.editableConfigs['pharmacy_location'] = this.generalConfigForm.value['pharmacyLocation'];
    this.editableConfigs['insurance_house'] = this.generalConfigForm.value['insuranceHouse'];
    this.editableConfigs['insurance_contract_no'] = this.generalConfigForm.value['insuranceHouseContractNo'];

    this.mainApi.updateConfigs(this.editableConfigs).subscribe(
      data => {
        this.currentConfigs = this.editableConfigs;
        this.toggleEditMode(false);
      }
    );
  }
}
