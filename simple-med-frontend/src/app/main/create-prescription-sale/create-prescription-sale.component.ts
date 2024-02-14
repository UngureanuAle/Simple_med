import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { MainApiService } from '../main-api.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-create-prescription-sale',
  templateUrl: './create-prescription-sale.component.html',
  styleUrls: ['./create-prescription-sale.component.css'],
})
export class CreatePrescriptionSaleComponent {
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  mainApi = inject(MainApiService);
  saleForm: FormGroup;

  @Input() prescriptionItemList: any;
  @Input() prescriptionInfo: any;
  @Input() recieverInfo: any;
  @Input() isOnline: any;
  @Output() onSaleFinished: EventEmitter<any> = new EventEmitter();

  @ViewChild('summaryTable') summaryTable: MatTable<any>;
  currentItem: any;
  currentProduct: any = {
    name: '',
    price: 0,
    sold_per_unit: false,
    price_per_unit: 0,
  };
  addedItemsList: any = [];

  errMsg = '';
  validationErrors = [];

  displayedColumns = [
    'nr',
    'drug_info',
    'copayment_list_percent',
    'name',
    'sold_per_unit',
    'price',
    'quantity',
    'totalPrice',
    'deleteAction',
  ];

  ngOnInit() {
    this.saleForm = this.fb.group({
      nr: '',
      drug_name: '',
      pharmaceutical_form: '',
      concentration: '',
      presc_quantity: '',
      sold_per_unit: false,
      units_per_box: '',
      quantity: '1',
      cod: '',
    });

    this.saleForm.controls['drug_name'].disable();
    this.saleForm.controls['drug_name'].disable();
    this.saleForm.controls['pharmaceutical_form'].disable();
    this.saleForm.controls['concentration'].disable();
    this.saleForm.controls['presc_quantity'].disable();
    this.saleForm.controls['units_per_box'].disable();
    this.saleForm.controls['nr'].disable();
    this.showNextPrescriptionItem();

    this.saleForm.controls['cod'].valueChanges
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged(), // only emit if the value has changed
        switchMap((cod: string) =>
          this.mainApi.getProductByCode(cod).pipe(
            catchError((error: any) => {
              return 'e';
            })
          )
        )
      )
      .subscribe((data: any) => {
        if (data === 'e') {
          this.errMsg = 'Nu exista niciun produs cu acest cod!';
          this.currentProduct = {
            name: '',
            price: 0,
          };
          this.saleForm.get('sold_per_unit').disable();
        } else {
          this.errMsg = null;
          this.currentProduct = {
            id: data.id,
            cod: data.cod,
            name: data.name,
            is_prescribed: data.is_prescribed,
            quantity: this.saleForm.value['quantity'],
            price: data.price,
            sold_per_unit: data.sold_per_unit,
            price_per_unit: data.price_per_unit,
            units_per_box: data.units_per_box,
          };

          if (this.currentProduct.sold_per_unit)
            this.saleForm.get('sold_per_unit').enable();
          else {
            this.saleForm.get('sold_per_unit').disable();
            this.saleForm.controls['sold_per_unit'].setValue(false);
          }
        }
      });

    this.saleForm.controls['quantity'].valueChanges.subscribe((value) => {
      if (parseInt(value) <= 0) this.saleForm.controls['quantity'].setValue(1);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prescriptionItemList']) {
      this.showNextPrescriptionItem();
      this.addedItemsList = [];
    }
  }

  onAdd() {
    if (!this.errMsg) {
      this.addedItemsList.push({
        nr: this.currentItem['nr'],
        drug_code: this.currentItem['drug_code'],
        pharmaceutical_form: this.currentItem['pharmaceutical_form'],
        concentration: this.currentItem['concentration'],
        presc_quantity: this.currentItem['quantity'],
        cod: this.currentProduct.cod,
        name: this.currentProduct.name,
        is_prescribed: this.currentProduct.is_prescribed,
        quantity: this.saleForm.value['quantity'],
        price: this.currentProduct.price,
        sold_per_unit: this.saleForm.value['sold_per_unit'] ? this.saleForm.value['sold_per_unit']: false,
        price_per_unit: this.currentProduct.price_per_unit,
        units_per_box: this.currentProduct.units_per_box,
        copayment_list_percent: this.currentItem['copayment_list_percent']
      });
      this.resetSaleForm();
      this.showNextPrescriptionItem();
      this.summaryTable.renderRows();
    }
  }

  showNextPrescriptionItem() {
    let sw = false;
    this.prescriptionItemList.forEach((presciptionItem: any) => {
      if (
        !this.addedItemsList.find((item) => item.nr === presciptionItem.nr) &&
        !sw
      ) {
        console.log(presciptionItem);
        this.currentItem = presciptionItem;
        this.saleForm.controls['drug_name'].setValue(
          this.formatDrugCode(presciptionItem.drug_code)
        );
        this.saleForm.controls['pharmaceutical_form'].setValue(
          presciptionItem.pharmaceutical_form
        );
        this.saleForm.controls['concentration'].setValue(
          presciptionItem.concentration
        );
        this.saleForm.controls['presc_quantity'].setValue(
          presciptionItem.quantity
        );
        this.saleForm.controls['nr'].setValue(presciptionItem.nr);
        sw = true;
      }
    });

    if(!sw)
      this.toggleForm(false);
    else
      this.toggleForm(true);
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

  openProductDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent);
    dialogRef.afterClosed().subscribe((cod) => {
      if (cod) this.saleForm.controls['cod'].setValue(cod);
    });
  }

  getCurrentPrice() {
    if (!this.currentProduct.sold_per_unit) return this.currentProduct.price;
    else {
      if (this.saleForm) {
        if (this.saleForm.value.sold_per_unit)
          return this.currentProduct.price_per_unit;
        else return this.currentProduct.price;
      } else return this.currentProduct.price;
    }
  }

  resetSaleForm() {
    this.saleForm.reset();
    this.saleForm.controls['quantity'].setValue('1');
    this.saleForm.controls['sold_per_unit'].setValue(false);
    this.currentProduct = Object.assign(
      {},
      { name: '', price: 0, sold_per_unit: false, price_per_unit: 0 }
    );
    this.currentItem = undefined;
  }

  toggleForm(toggle: boolean){
    if( !toggle ){
      this.saleForm.controls['sold_per_unit'].disable();
      this.saleForm.controls['cod'].disable();
      this.saleForm.controls['quantity'].disable();
    } else {
      this.saleForm.controls['sold_per_unit'].enable();
      this.saleForm.controls['cod'].enable();
      this.saleForm.controls['quantity'].enable();
    }
      
  }

  getItemsTotalPrice() {
    let total = 0;
    this.addedItemsList.forEach((item) => {
      if( item.sold_per_unit )
        total += item.price_per_unit * item.quantity;
      else
        total += item.price * item.quantity;
    });
    return total;
  }

  getItemsPriceDecontat(){
    let total = 0;
    this.addedItemsList.forEach((item) => {
      if( item.sold_per_unit )
        total += (item.price_per_unit * item.quantity) - (item.price_per_unit * item.quantity) * (item.copayment_list_percent / 100); // - (item.price_per_unit * item.quantity) * item.;
      else
        total += (item.price * item.quantity) - (item.price * item.quantity) * (item.copayment_list_percent / 100);
    });
    return total;
  }

  deleteItem(item: any) {
    const index = this.addedItemsList.indexOf(item);
    this.addedItemsList.splice(index, 1);
    this.summaryTable.renderRows();
    this.showNextPrescriptionItem();
  }

  formatDrugInfo(element: any){

    return `${this.formatDrugCode(element.drug_code)}/${element.pharmaceutical_form}/${element.concentration}/${element.presc_quantity}`;
  }

  checkout(){
    const data = {
      'online': this.isOnline,
      'prescription_info': this.prescriptionInfo,
      'given_items_for_prescribed': this.addedItemsList,
      'reciever_info': this.recieverInfo
    };

    this.mainApi.createPrescriptionSale(data).subscribe(
      (response: any) => {
        if( response['errors'].length < 1 ){
          this.validationErrors = [];
          this.onSaleFinished.emit();
        }
        else
          this.validationErrors = response['errors'];
      },
      (error: any) => {
        this.validationErrors = ['Eroare la serverul SimpleMED'];
      }
    )
  }

}
