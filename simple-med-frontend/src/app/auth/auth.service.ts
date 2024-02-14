import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  LOGIN_URL = 'http://localhost:8000/auth/login';
  
  login(username: string, password: string) {
    return this.http.post(this.LOGIN_URL, {
      username: username,
      password: password
    });
  }

  logout(){
    window.localStorage.removeItem('simple-med-token');
  }

  isAuthenticated(){
    if( window.localStorage.getItem('simple-med-token') )
      return true;
    else
      return false;
  }

  getTokenString(){
    return `Token ${window.localStorage.getItem('simple-med-token')}`;
  }

  getCurrentOperator(){
    return window.localStorage.getItem('simple-med-operator');
  }

  isCurrentOperatorAdmin(){
    if ( window.localStorage.getItem('simple-med-isadmin') === 'true' )
      return true;
    else
      return false;
  }

  getUsers(
    username: string | null,
    first_name: string | null,
    last_name: string | null,
    is_admin: boolean | null,
  ){
    let URL = `http://localhost:8000/auth/users?`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.getTokenString(), // Add any other headers as needed
    });

    if (username) URL = `${URL}username=${username}&`;
    if (first_name) URL = `${URL}first_name=${first_name}&`;
    if (last_name) URL = `${URL}last_name=${last_name}&`;
    if (is_admin) URL = `${URL}is_admin=${is_admin}&`;

    return this.http.get(URL, { headers: headers });
  }

  getUser(
    username: string
  ){
    let URL = `http://localhost:8000/auth/user?username=${username}`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }

  createUser(
    userData: any
  ){
    let URL = `http://localhost:8000/auth/user/create`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.getTokenString(), // Add any other headers as needed
    });

    return this.http.post(URL, userData, { headers: headers });
  }

  deleteUser(id: string) {
    let URL = `http://localhost:8000/auth/user/delete/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getTokenString(), // Add any other headers as needed
    });

    return this.http.delete(URL, { headers: headers });
  }

  updateUser(newData: any) {
    let URL = `http://localhost:8000/auth/user/update/${newData.id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getTokenString(), // Add any other headers as needed
    });

    return this.http.put(URL, newData, { headers: headers });
  }
}
