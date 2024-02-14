import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);

  searchForm: FormGroup;
  usersList: any = [];
  currentView: 'OVERVIEW' | 'DETAILS' = 'OVERVIEW';
  nextOperation: 'INSERT' | 'UPDATE' = 'UPDATE';
  currentUser: any;
  displayedColumns = [
    'username',
    'last_name',
    'first_name',
    'is_admin',
    'insertAction'
  ]

  ngOnInit(){
    this.searchForm = this.fb.group({
      username: '',
      first_name: '',
      last_name: '',
      is_admin: ''
    });
    this.fetchUsers();
  }

  clearFilters(){
    this.searchForm.reset();
    this.fetchUsers();
  }

  fetchUsers(){
    const username = (this.searchForm.value.username ? this.searchForm.value.username : null);
    const last_name = (this.searchForm.value.last_name ? this.searchForm.value.last_name : null);
    const first_name = (this.searchForm.value.first_name ? this.searchForm.value.first_name : null);
    const is_admin = (this.searchForm.value.is_admin ? this.searchForm.value.is_admin : null);

    this.auth.getUsers(
      username,
      first_name,
      last_name,
      is_admin
    ).subscribe(
      (data: any) => {
        this.usersList = data;
      }
    )
  }

  toggleBetweenViews(){
    if (this.currentView === 'OVERVIEW') this.currentView = 'DETAILS';
    else if (this.currentView === 'DETAILS'){
      this.currentView = 'OVERVIEW'
      this.fetchUsers();
    } ;
  }

  openEditPage(operation: 'INSERT' | 'UPDATE', row: any | null){

    if( operation === 'UPDATE' && row ){
      this.nextOperation = 'UPDATE';
      this.auth.getUser(row.username).subscribe(
        (response) => {
          this.currentUser = response;
          this.toggleBetweenViews();
        }
      );
    }
    else if( operation === 'INSERT' && !row){
      this.nextOperation = 'INSERT';
      this.currentUser = undefined;
      this.toggleBetweenViews();
    }
  }
}
