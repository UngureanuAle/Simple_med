import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  router = inject(Router);
  auth = inject(AuthService);
  activeNavItem = 'inventory';
  currentUser: string | null = null;

  ngOnInit(){
    this.currentUser = this.auth.getCurrentOperator();
    console.log(this.currentUser);
  }

  reroute(newRoute: string){
    console.log(newRoute);
    this.router.navigate([newRoute]);
  }

  setActive(){

  }

  logout(){
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
