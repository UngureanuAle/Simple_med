// auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Assuming you have an AuthService for handling authentication

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  auth = inject(AuthService);
  router = inject(Router);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      return true; // Allow access to the route
    } else {
      // Redirect to the login page or any other route
      return this.router.navigate(['/login']);
    }
  }
}