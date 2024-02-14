import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ProductDisplay } from '../interfaces/Product';
import { MainApiService } from '../main-api.service';
import { MatDialog } from '@angular/material/dialog';

type Operation = 'INSERT' | 'UPDATE';

@Component({
  selector: 'app-crud-products',
  templateUrl: './crud-products.component.html',
  styleUrls: ['./crud-products.component.css'],
})
export class CrudProductsComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);
  dialog = inject(MatDialog);
  crudForm: FormGroup;
  errMsg: string = '';
 

  @Input() currentProduct: ProductDisplay | undefined;
  @Input() isEditing: boolean = false;
  @Input() currentOperation: Operation = 'INSERT';
  @Output() onBack = new EventEmitter();

  editableProduct: ProductDisplay | undefined = undefined;
  medTypeOptions = [
    [1, 'Antibiotice'],
    [2, 'Antivirale'],
    [3, 'Antiinflamatoare'],
    [4, 'Antidepresive, anxiolitice și antipsihotice'],
    [5, 'Antineoplazice'],
    [6, 'Antidiabetice'],
    [7, 'Anticoagulante și antiagregante plachetare'],
    [8, 'Antipiretice'],
    [9, 'Analgezice']
  ];

  admTypeOptions = [
    [1, 'Orală'],
    [2, 'Intravenoasă'],
    [3, 'Topicală'],
    [4, 'Inhalatorie']
  ];

  ngOnInit() {
    this.crudForm = this.fb.group({
      id: { value: '', hidden: true, disabled: true },
      cod: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      name: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      manufacturer: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      is_prescribed: {
        value: false,
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      med_type: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      adm_type: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      description: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      price: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      sold_per_unit: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      price_per_unit: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      units_per_box: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      prospect: { value: undefined, disabled: true},
    }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentOperation']) {
      if (changes['currentOperation'].currentValue === 'INSERT') {
        this.isEditing = true;
        this.updateControlStatusRecursive(this.crudForm, this.isEditing);
      } else if (changes['currentOperation'].currentValue === 'UPDATE') {
        this.isEditing = false;
        this.updateControlStatusRecursive(this.crudForm, this.isEditing);
      }
    }

    if (changes['currentProduct']) {
      this.resetEditableProduct(changes['currentProduct'].currentValue);
    }
  }

  toggleEditMode(val: boolean) {
    this.errMsg = '';
    this.isEditing = val;
    this.updateControlStatusRecursive(this.crudForm, this.isEditing);

    if( !this.isEditing )
      this.resetEditableProduct(this.currentProduct);
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

  private resetEditableProduct(newValues: ProductDisplay | undefined){
    if( newValues ){
      this.editableProduct = Object.assign(
        {},
        newValues
      ) as ProductDisplay;
      this.crudForm.patchValue(this.editableProduct);
    }
    else {
      this.editableProduct = undefined;
      this.crudForm.reset();
    }
    
  }

  goBack() {
    this.errMsg = '';
    this.onBack.emit();
    this.crudForm.reset();
  }

  viewProspect(){
    if( this.currentProduct )
      window.open(`${this.mainApi.ROOT_URL}${this.currentProduct.prospect}`, '_blank');
  }

  onOK(){
    this.errMsg = '';
    if( this.currentOperation === 'INSERT'){
      this.resetEditableProduct(this.crudForm.value);

      const selectedMedTypeText: string = this.medTypeOptions[0][1] as string;
      const selectedAdmTypeText: string = this.admTypeOptions[0][1] as string;

      const temp: ProductDisplay = {
        id: '',
        cod: this.editableProduct.cod,
        name: this.editableProduct.name,
        manufacturer: this.editableProduct.manufacturer,
        med_type_display: selectedMedTypeText,
        med_type: this.editableProduct.med_type,
        description: this.editableProduct.description,
        adm_type_display: selectedAdmTypeText,
        adm_type: this.editableProduct.adm_type,
        prospect: this.editableProduct.prospect,
        is_prescribed: this.editableProduct.is_prescribed,
        price: this.editableProduct.price,
        sold_per_unit: this.editableProduct.sold_per_unit,
        price_per_unit: this.editableProduct.price_per_unit,
        units_per_box: this.editableProduct.units_per_box,
      }
      
      console.log(temp);
      if( temp )
        this.mainApi.createProduct(temp).subscribe(
            (response) => {
              this.goBack();
            },
            (error) => {
              console.log(error);
              this.errMsg = error['error'];
            }
          );
    }
    else if(this.currentOperation === 'UPDATE'){
      this.resetEditableProduct(this.crudForm.value);
      //window.alert(this.editableProduct.price)
      console.log(this.editableProduct);
      
      this.mainApi.updateProduct(this.editableProduct).subscribe(
        (response: ProductDisplay) => {
          this.toggleEditMode(false);
          this.resetEditableProduct(response);
          this.currentProduct = Object.assign({}, this.editableProduct) as ProductDisplay;
        },
        (error) => {
          console.log(error);
          this.errMsg = error['error'];
        }
      )
    }
    
  }

  deleteProduct(){
    const productId = this.currentProduct.id;
    this.mainApi.deleteProduct(productId).subscribe(
      (response) => {
        this.goBack();
      },
      (error) => {
        this.errMsg = 'A intervenit o eroare la stergere!';
      }
    )
  }
}
