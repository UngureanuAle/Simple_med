import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  errMessage = '';
  
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new FormControl(
        '', [Validators.required]
      ),
      password: new FormControl(
        '', [Validators.required]
      ),
    })
  }

  private _storeToken(token: string){
    window.localStorage.setItem('simple-med-token', token);
  }

  private _storeName(firstName: string, lastName: string){
    window.localStorage.setItem('simple-med-operator', `${firstName} ${lastName}`);
  }

  private _storeIsAdmin(isAdmin: boolean){
    window.localStorage.setItem('simple-med-isadmin', `${isAdmin}`);
  }

  submitLogin(){
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.errMessage = '';
    
    if ( this.loginForm.valid )
      this.auth.login(username, password).subscribe(
        (response: any) => {
          console.log(response);
          this._storeToken(response.token);
          this._storeName(response.first_name, response.last_name);
          this._storeIsAdmin(response.is_admin);
          this.router.navigate(['/']);
        },
        (err) => {
          console.log(err);
          if( err.status === 404 )
            this.errMessage = 'Credențiale invalide!';
          else if( err.status === 0 )
          this.errMessage = 'Eroare server!';
        }
      );
  }
}
