import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud-users.component.html',
  styleUrls: ['./crud-users.component.css']
})
export class CrudUsersComponent {

  fb = inject(FormBuilder);
  auth = inject(AuthService);

  crudForm: FormGroup;
  @Input() currentUser: any;
  @Input() currentOperation: 'INSERT' | 'UPDATE';
  @Output() onBack: EventEmitter<any> = new EventEmitter();
  errMsg: string = '';
  isEditing: boolean = false;
  editableUser: any = undefined;
  hide = true;

  ngOnInit(){
    this.crudForm = this.fb.group({
      id: { value: '', hidden: true, disabled: true },
      username: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      last_name: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      password: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      first_name: {
        value: '',
        disabled: !this.isEditing && this.currentOperation === 'UPDATE',
      },
      is_admin: {
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

    if (changes['currentUser']) {
      console.log(changes['currentUser'].currentValue);
      this.resetEditableUser(changes['currentUser'].currentValue);
      this.crudForm.controls['password'].setValue('');
    }
  }

  private resetEditableUser(newValues: any) {
    if (newValues) {
      this.editableUser = Object.assign({}, newValues);
      this.crudForm.patchValue(this.editableUser);
    } else {
      this.editableUser = undefined;
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

  toggleEditMode(val: boolean) {
    this.errMsg = '';
    this.isEditing = val;
    this.updateControlStatusRecursive(this.crudForm, this.isEditing);

    if (!this.isEditing) this.resetEditableUser(this.currentUser);
  }

  goBack(){
    this.onBack.emit();
  }

  onOk() {
    this.errMsg = '';
    if (this.currentOperation === 'INSERT') {
      this.resetEditableUser(this.crudForm.value);

      this.auth.createUser(this.editableUser).subscribe(
        (response) => {
          this.goBack();
        },
        (error) => {
          console.log(error);
          this.errMsg = error['error'];
        }
      );
    } else if (this.currentOperation === 'UPDATE') {  
      this.resetEditableUser(this.crudForm.value);


      this.auth.updateUser(this.editableUser).subscribe(
        (response) => {
          this.currentUser = Object.assign({}, this.editableUser);
          this.toggleEditMode(false);
        },
        (error) => {
          console.log(error);
          this.errMsg = error['error'];
        }
      );
    }
  }

  deleteUser(){
    const userId = this.crudForm.value.id;

    this.auth.deleteUser(userId).subscribe(
      data => {
        this.goBack();
      },
      error => {
        this.errMsg = error['error'];
      }
    )
  }
}
