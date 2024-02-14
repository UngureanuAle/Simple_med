import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-prescription-reader',
  templateUrl: './prescription-reader.component.html',
  styleUrls: ['./prescription-reader.component.css'],
})
export class PrescriptionReaderComponent {
  fb = inject(FormBuilder);
  prescriptionReaderForm: FormGroup;
  diseaseTableData: any = [];
  drugInfoData: any = [];

  @Input() prescription: any;

  ngOnInit() {
    this.prescriptionReaderForm = this.fb.group({
      series: '',
      nr: '',
      medical_facility: '',
      source: '',
      address: '',
      cui: '',
      insurance_house: '',
      insurance_house_code: '',
      phone_nr: '',
      email: '',
      first_name: '',
      last_name: '',
      patient_type: '',
      cid: '',
      birth_date: '',
      sex: '',
      nationality: '',
      created_at: '',
      name: '',
      stencil_nr: '',
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prescription']) {
      console.log(changes['prescription'].currentValue);
      this.updateData(changes['prescription'].currentValue);
    }
  }

  updateData(newData: any) {
    this.prescriptionReaderForm.controls['series'].setValue(newData['series']);
    this.prescriptionReaderForm.controls['nr'].setValue(newData['nr']);
    this.prescriptionReaderForm.controls['created_at'].setValue(
      newData['created_at']
    );
    this.prescriptionReaderForm.controls['name'].setValue(
      this.prescription['presciptor']['name']
    );
    this.prescriptionReaderForm.controls['stencil_nr'].setValue(
      newData['presciptor']['stencil_nr']
    );

    this.prescriptionReaderForm.controls['first_name'].setValue(
      newData['patient']['first_name']
    );
    this.prescriptionReaderForm.controls['last_name'].setValue(
      newData['patient']['last_name']
    );
    this.prescriptionReaderForm.controls['cid'].setValue(
      newData['patient']['cid']
    );
    this.prescriptionReaderForm.controls['birth_date'].setValue(
      newData['patient']['birth_date']
    );
    this.prescriptionReaderForm.controls['sex'].setValue(
      newData['patient']['sex']
    );
    this.prescriptionReaderForm.controls['nationality'].setValue(
      newData['patient']['nationality']
    );
    this.prescriptionReaderForm.controls['patient_type'].setValue(
      newData['patient']['patient_type']
    );

    this.prescriptionReaderForm.controls['medical_facility'].setValue(
      newData['presciptor']['medical_facility']
    );
    this.prescriptionReaderForm.controls['source'].setValue(this.formatSource(newData['source']));
    this.prescriptionReaderForm.controls['address'].setValue(
      newData['presciptor']['adress']
    );
    this.prescriptionReaderForm.controls['phone_nr'].setValue(
      newData['presciptor']['phone_nr']
    );
    this.prescriptionReaderForm.controls['email'].setValue(
      newData['presciptor']['email']
    );
    this.prescriptionReaderForm.controls['cui'].setValue(
      newData['presciptor']['cui']
    );
    this.prescriptionReaderForm.controls['insurance_house'].setValue(
      newData['presciptor']['insurance_house']
    );
    this.prescriptionReaderForm.controls['insurance_house_code'].setValue(
      newData['presciptor']['insurance_house_code']
    );

    this.createDiseaseTableData(newData['prescription_items']);
    this.createDrugInfoData(newData['prescription_items'], newData['treatment_days']);
  }

  private formatSource(sourceVal: number) {
    switch (sourceVal) {
      case 0:
        return 'Medic de familie';
        break;
      case 1:
        return 'Ambulatoriu';
        break;
      case 2:
        return 'Spital';
        break;
      case 3:
        return 'Ambulanta';
        break;
      case 4:
        return 'Altele';
        break;
      case 5:
        return 'MF - MM';
        break;
      default:
          return 'Necunoscut';
    }
  }

  formatPatientType(index: number){
    const patientType = this.prescriptionReaderForm.value['patient_type'];

    return parseInt(patientType[index]) ? true : false;
  }

  formatDiseaseCode(diseaseCode){
    switch (diseaseCode) {
      case '320':
        return 'Tulburare afectiva bipolara';
      case '321':
        return 'Episod depresiv';
      case '377':
        return 'Tulburari de somn';
      case '504':
        return 'Gripa cu virus identificat';
      case '232':
        return 'Sarcoidoza';
      case '241':
        return 'Diabetul zaharat insulino-dependent';
      case '271':
        return 'Carenta in zinc';
      default:
        return 'Disease code not found';
    }
  }

  formatDrugCode(medicineCode) {
    switch (medicineCode) {
      case 'N05CF02':
        return 'ZOLPIDEMUM';
      case 'N06AB03':
        return 'FLUOXETINUM';
      case 'N06AB06':
        return 'SERTRALINUM';
      case 'N06AB08':
        return 'FLUVOXAMINUM';
      case 'N06AX21':
        return 'DULOXETINUM';
      default:
        return 'Medicine code not found';
    }
  }

  createDiseaseTableData(items: any){
    this.diseaseTableData = [];
    items.forEach(
      (prescriptionItem: any) => {
        const newEntry = {
          'disease_code': prescriptionItem.disease_code,
          'disease_name': this.formatDiseaseCode(prescriptionItem.disease_code)
        };

        const diseaseCodeExists = this.diseaseTableData.some(item => item.disease_code === newEntry.disease_code);
        if (!diseaseCodeExists)
          this.diseaseTableData.push(newEntry);
      }
    );
  }

  createDrugInfoData(items: any, treatment_days){
    this.drugInfoData = [];
    items.forEach(
      (prescriptionItem: any) => {
        const newEntry = {
          nr: prescriptionItem.nr,
          disease_code: prescriptionItem.disease_code,
          drug_info: `${this.formatDrugCode(prescriptionItem.drug_code)}/${prescriptionItem.pharmaceutical_form}/${prescriptionItem.concentration}`,
          dose: prescriptionItem.dose,
          quantity: prescriptionItem.quantity,
          treatment_days: treatment_days,
          copayment_list_percent: prescriptionItem.copayment_list_percent,
          copayment_list_type: prescriptionItem.copayment_list_type,
          diagnostic_type: prescriptionItem.diagnostic_type
        };
        this.drugInfoData.push(newEntry);
      }
    )
  }

  
}
