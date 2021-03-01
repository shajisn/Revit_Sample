import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { CSIGenAppConfig } from '../csi-gen.application.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor(    
    private readonly applicationConfig: CSIGenAppConfig,
  ) 
  {
    console.log("Auth Service started ...");
    this.manager.getUser().then(user => {
      this.user = user;
      console.log("Logged in user = " + this.userJson);      
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.manager.getUser().then(user => {
      this.user = user;
      // console.log("Logged in user = " + this.userJson);
      let loggedIn = this.user != null && !this.user.expired;
      if (loggedIn) {
        let user_det = this.user.profile.email ? this.user.profile.email : this.user.profile.name;
        console.log("User : " + user_det + " is logged in. ");
      }
      else
        console.log("Logged in false ....");
      return loggedIn;
    });
  }

  public getUser(): Promise<User> {
    return this.manager.getUser();
  }

  public setUser(): void {
    this.manager.getUser().then(user => {
      this.user = user;
      if (user) {
        console.log('User Logged In' + this.userJson);
      } else {
        console.log('User Not Logged In');
      } 
    });
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    console.log("Starting Authentication ...")
    return this.manager.signinRedirect().then(
    );
  }

  completeAuthentication(): Promise<void> {
    console.log("Completing Authentication....After SignIn redirect")
    
    return this.manager.signinRedirectCallback().then(user => {
        this.user = user;
        console.log("User Details: " + this.userJson);
    });
  }

  get userJson(): string {
    return JSON.stringify(this.user, null, 2);
  }
  public renewToken(): Promise<User> {
    return this.manager.signinSilent();
  }

  public logout(): Promise<void> {
    return this.manager.signoutRedirect().then(res => {
        console.log('Redirection to signout triggered.', res);
        debugger;
    });
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
      // authority: 'https://test-login.gordian.com',
      client_id: 'CSIGenUI',
      // redirect_uri: window.location.protocol + "//" + window.location.host + "/auth",
      // post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "/csigen/logout",
      // silent_redirect_uri: window.location.protocol + "//" + window.location.host + "/blank.html",
      // response_type: "id_token token",
      // scope: "openid email profile roles",

      // client_id: 'ai-estimator',
      // redirect_uri: window.location.protocol + "//" + window.location.host + "/ai-estimator/redirect.html",
      // post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "/csigen/logout",
      // response_type:"id_token token",
      // scope:"openid email profile roles ai-estimator:readwrite",

      authority: 'https://test-login.gordian.com',
      // client_id: 'gordian-ionic-web-client',
      redirect_uri: window.location.protocol + '//' + window.location.host + '/signin-callback.html',
      post_logout_redirect_uri: window.location.protocol + '//' + window.location.host + '/',
      response_type: 'id_token token',
      scope: 'openid email profile roles',
      silent_redirect_uri: window.location.protocol + '//' + window.location.host + '/silent-callback.html',
      automaticSilentRenew: true,
      
      filterProtocolClaims: true,
      loadUserInfo: true
  };
}

