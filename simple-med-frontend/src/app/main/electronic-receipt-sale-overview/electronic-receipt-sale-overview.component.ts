import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { datamatrix } from 'bwip-js';
import { MainApiService } from '../main-api.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-electronic-receipt-sale-overview',
  templateUrl: './electronic-receipt-sale-overview.component.html',
  styleUrls: ['./electronic-receipt-sale-overview.component.css'],
})
export class ElectronicReceiptSaleOverviewComponent implements AfterViewInit{
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);

  pacientForm: FormGroup;
  receiptDataForm: FormGroup;
  cardForm: FormGroup;
  represantativeForm: FormGroup;

  consultationMsg: string = '';
  consultationIsErr: boolean = true;
  isCarDataCompatible: boolean = false;
  isOnline: boolean = false;

  barcodeFile: File | undefined;
  currentPrescription: any = undefined;
  recieverInfo: any = {};

  @ViewChild('recieverSelect') recieverSelect: MatSelect;
  @Output() onBack: EventEmitter<any> = new EventEmitter();
  @Output() onSaleFinished: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit(){
    this.recieverSelect.value = 'A';
  }

  ngOnInit() {
    this.receiptDataForm = this.fb.group({
      barcodee_file: '',
      series: ['', Validators.required],
      nr: ['', Validators.required],
      stencil_nr: ['', Validators.required],
      prescription_date: ['', Validators.required],
      prescriptor_signature:
        '',
    });

    this.cardForm = this.fb.group({
      cid: ['5677745', Validators.required],
      cnp: ['123445669182', Validators.required],
      first_name: ['Marian', Validators.required],
      last_name: ['Radute', Validators.required],
      private_key: ['asd', Validators.required],
    });

    this.represantativeForm = this.fb.group({
      first_name: ['Mihai', Validators.required],
      last_name: ['Panzila', Validators.required],
      cnp: ['123445669333', Validators.required]
    });
  }

  onVerify() {
    if (this.receiptDataForm.valid) {
      this.consultationMsg = '';
      this.consultationIsErr = false;

      this.mainApi
        .getPrescription(
          this.receiptDataForm.value['series'],
          this.receiptDataForm.value['nr'],
          this.receiptDataForm.value['stencil_nr'],
          this.receiptDataForm.value['prescription_date'],
          this.receiptDataForm.value['prescriptor_signature']
        )
        .subscribe(
          (data: any) => {
            console.log(data);
            if (data['online'] && data['prescription']['state'] !== 1) {
              this.isOnline = true;
              this.consultationIsErr = true;
              this.consultationMsg = 'Reteta a fost deja eliberata!';
              return;
            }

            if (data['online']) {
              this.isOnline = true;
              this.currentPrescription = data['prescription'];
              this.consultationMsg =
                'Reteta este valabila si a fost introdusa in SIPE de catre medicul prescriptor (ONLINE). Mergeti la urmatorul pas pentru a verifica datele acesteia!';
            } else {
              this.isOnline = false;
              this.consultationMsg =
                'Reteta este valida, dar NU a fost introdusa in SIPE de catre medicul prescriptor (OFFLINE). Aceasta va trebui validata de dvs. Mergeti la urmatorul pas pentru a verifica datele acesteia!';
            }
          },
          (err: any) => {
            this.consultationIsErr = true;
            this.consultationMsg =
              'Reteta nu este valida/autentica si nu exista in sistem! Posibila frauda!';
              this.currentPrescription = undefined;
          }
        );
    } else {
      this.consultationIsErr = true;
      this.consultationMsg =
        'Introduceti toate datele pentru a putea consulta reteta!';
    }
  }

  onBarcodeFileChange(event: any) {
    this.barcodeFile = event.target.files[0];
  }

  onScan() {
    if (this.barcodeFile)
      this.mainApi.scanBarcode(this.barcodeFile).subscribe((data: any) => {
        this.receiptDataForm.controls['series'].setValue(data['decoded_data']['prescription']['series']);
        this.receiptDataForm.controls['nr'].setValue(data['decoded_data']['prescription']['nr']);
        this.receiptDataForm.controls['prescription_date'].setValue(new Date(data['decoded_data']['prescription']['created_at']));
        this.receiptDataForm.controls['stencil_nr'].setValue(data['decoded_data']['prescription']['presciptor']['stencil_nr']);
        this.receiptDataForm.controls['prescriptor_signature'].setValue(data['decoded_data']['prescriptor_signature']);

        this.currentPrescription = data['decoded_data']['prescription'];
      });
  }

  checkCardCompatibility(){
    if( 
      this.currentPrescription['patient']['first_name'] === this.cardForm.value['first_name'] &&
      this.currentPrescription['patient']['last_name'] === this.cardForm.value['last_name'] &&
      this.currentPrescription['patient']['cid'] === this.cardForm.value['cid']
    )
      this.isCarDataCompatible = true;
    else
      this.isCarDataCompatible = false;
  }

  isRecieverDataReady(){
    if( !this.recieverSelect )
      return false;
    
    if( this.recieverSelect.value === 'A' ){
      if( this.cardForm.valid && this.isCarDataCompatible ){
        this.recieverInfo = {
          tip: 'A',
          cid: this.cardForm.value['cid'],
          cnp: this.cardForm.value['cnp'],
          first_name: this.cardForm.value['first_name'],
          last_name: this.cardForm.value['last_name'],
          private_key: this.cardForm.value['private_key']
        };

        return true;
      }
      else
        return false;
    }

    if( this.recieverSelect.value === 'I' ){
      if( this.represantativeForm.valid ){
        this.recieverInfo = {
          tip: 'I',
          cnp: this.cardForm.value['cnp'],
          first_name: this.cardForm.value['first_name'],
          last_name: this.cardForm.value['last_name'],
        };

        return true;
      }
      else
        return false;
    }

    return false;
  }

  resetAll(){
    this.receiptDataForm.reset();
    this.cardForm.reset();
    this.represantativeForm.reset();
    this.currentPrescription = undefined;
    this.recieverInfo = {};
  }
}
