import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';

type Operation = 'INSERT' | 'UPDATE';

@Component({
  selector: 'app-crud-batches',
  templateUrl: './crud-batches.component.html',
  styleUrls: ['./crud-batches.component.css'],
})
export class CrudBatchesComponent {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);
  crudForm: FormGroup;
  errMsg: string = '';

  @Input() currentBatch: any;
  @Input() isEditing: boolean = false;
  @Input() currentOperation: Operation = 'UPDATE';
  @Output() onBack = new EventEmitter();
  @Output() onCreatedUpdatedBatch = new EventEmitter();

  editableBatch: any = undefined;

  ngOnInit() {
    this.crudForm = this.fb.group({
      id: { value: '', hidden: true, disabled: true },
      product_id: { value: '', hidden: true, disabled: true },
      batch_nr: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      created_on: {
        value: '',
        disabled: true,
      },
      initial_pieces: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      provider: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      paid_price_per_unit: {
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

    if (changes['currentBatch']) {
      this.resetEditableBatch(changes['currentBatch'].currentValue);
    }
  }

  goBack() {
    this.errMsg = '';
    this.onBack.emit();
    this.crudForm.reset();
  }

  toggleEditMode(val: boolean) {
    this.errMsg = '';
    this.isEditing = val;
    this.updateControlStatusRecursive(this.crudForm, this.isEditing);

    if (!this.isEditing) this.resetEditableBatch(this.currentBatch);
  }

  onOk() {
    this.errMsg = '';
    if (this.currentOperation === 'INSERT') {
      this.resetEditableBatch(this.crudForm.value);

      this.mainApi.createBatch(this.editableBatch).subscribe(
        (response) => {
          this.onCreatedUpdatedBatch.emit();
          this.goBack();
        },
        (error) => {
          console.log(error);
          this.errMsg = error['error'];
        }
      );
    } else if (this.currentOperation === 'UPDATE') {
      //window.alert(this.crudForm.controls['expiring_date'].value);
      
      this.resetEditableBatch(this.crudForm.value);
      //window.alert(this.editableBatch.expiring_date);

      this.mainApi.updateBatch(this.editableBatch).subscribe(
        (response) => {
          this.currentBatch = Object.assign({}, this.editableBatch);
          this.toggleEditMode(false);
          //this.currentBatch = Object.assign({}, this.editableBatch);
          //this.resetEditableBatch(this.currentBatch);
          this.onCreatedUpdatedBatch.emit();
        },
        (error) => {
          console.log(error);
          this.errMsg = error['error'];
        }
      );
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
    formGroup.controls['created_on'].disable();
  }

  private resetEditableBatch(newValues: any) {
    if (newValues) {
      this.editableBatch = Object.assign({}, newValues);
      this.crudForm.patchValue(this.editableBatch);
    } else {
      this.editableBatch = undefined;
      this.crudForm.reset();
    }
  }

  deleteBatch(){
    this.mainApi.deleteBatch(this.currentBatch.id).subscribe(
      (response) => {
        this.onCreatedUpdatedBatch.emit();
        this.goBack();
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
