import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';

@Component({
  selector: 'app-crud-clients',
  templateUrl: './crud-clients.component.html',
  styleUrls: ['./crud-clients.component.css'],
})
export class CrudClientsComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);

  crudForm: FormGroup;
  @Input() currentClient: any;
  @Input() currentOperation: 'INSERT' | 'UPDATE';
  @Output() onBack: EventEmitter<any> = new EventEmitter();
  errMsg: string = '';
  isEditing: boolean = false;
  editableClient: any = undefined;

  ngOnInit(){
    this.crudForm = this.fb.group({
      id: { value: '', hidden: true, disabled: true },
      cnp: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      last_name: {
        value: '',
        disabled: true,
      },
      first_name: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      phone_nr: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
    });
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

    if (changes['currentClient']) {
      this.resetEditableClient(changes['currentClient'].currentValue);
    }
  }

  goBack(){
    this.onBack.emit();
  }

  toggleEditMode(val: boolean) {
    this.errMsg = '';
    this.isEditing = val;
    this.updateControlStatusRecursive(this.crudForm, this.isEditing);

    if (!this.isEditing) this.resetEditableClient(this.currentClient);
  }

  private resetEditableClient(newValues: any) {
    if (newValues) {
      this.editableClient = Object.assign({}, newValues);
      this.crudForm.patchValue(this.editableClient);
    } else {
      this.editableClient = undefined;
      this.crudForm.reset();
    }
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

  onOk() {
    this.errMsg = '';
    if (this.currentOperation === 'INSERT') {
      this.resetEditableClient(this.crudForm.value);

      this.mainApi.createClient(this.editableClient).subscribe(
        (response) => {
          this.goBack();
        },
        (error) => {
          console.log(error);
          this.errMsg = error['error'];
        }
      );
    } else if (this.currentOperation === 'UPDATE') {  
      this.resetEditableClient(this.crudForm.value);


      this.mainApi.updateClient(this.editableClient).subscribe(
        (response) => {
          this.currentClient = Object.assign({}, this.editableClient);
          this.toggleEditMode(false);
        },
        (error) => {
          console.log(error);
          this.errMsg = error['error'];
        }
      );
    }
  }

  deleteClient(){
    this.mainApi.deleteClient(this.currentClient.id).subscribe(
      (response) => {
        this.goBack();
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
