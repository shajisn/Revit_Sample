import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service'

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor( private authService: AuthService ) { }

  async canActivate(): Promise<boolean> {
    console.log("Checking Activation..." + this.authService.userJson);
    return this.authService.isLoggedIn().then((login_flag) => {
      if(login_flag) {
        // console.log("User is logged in...")
        return true;
      }
      else {
        this.authService.startAuthentication();
        console.log("User not logged in...")
        return false;
      }
    });
  } 
}