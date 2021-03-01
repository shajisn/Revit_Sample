export class ApplicationConfig implements IApplicationConfig {
  public angularProdMode: boolean;
  //identity server enpoint url
  public authority: string;
  public client_id: string;
  //zendesk endpoint
  public zendeskUrl: string;
  public zendeskAnnouncementTags: string;
  //
  //google tag manager
  public googleTagManagerId: string;
  public applicationId: number;
  public authConstants: AuthConstantsConfig = new AuthConstantsConfig();
  public loginPage: string;
  public defaultPage: string;
  public localStoragePrefix: string;
  //delay between requests to avoid duplicates
  public timeOutBetweenRequests: number;
  public portalUrl: string;
  public reportsAppUrl: string;
  public commandCenterHomeUrl: string;
  public trackPageView: boolean;
  public loginManagerUrl: string;
  public sentryKey: string;
  public eutaApiBaseUrl: string;
  public lcmApiBaseUrl: string;
  public ccPortalApiUrl: string;

  constructor() {
    console.log("ApplicationConfig constructor");
  }
}

export interface IApplicationConfig {
  angularProdMode: boolean;
  //identity server enpoint url
  authority: string;
  client_id: string;
  //zendesk endpoint
  zendeskUrl: string;
  zendeskAnnouncementTags: string;
  //goole tag manager
  googleTagManagerId: string;
  applicationId: number;
  authConstants: AuthConstantsConfig;
  loginPage: string;
  defaultPage: string;
  localStoragePrefix: string;
  //delay between requests to avoid duplicates
  timeOutBetweenRequests: number;
  portalUrl: string;
  reportsAppUrl: string;
  commandCenterHomeUrl: string;
  trackPageView: boolean;
  loginManagerUrl: string;
  sentryKey: string;
}

export class AuthConstantsConfig {
  public redirect_uri: string;
  public post_logout_redirect_uri: string;
  public silent_redirect_uri: string;
  public response_type: string;
  public scope: string;
  public silent_renew: boolean;

  constructor(model?: any) {
    if (model === undefined) return;
    if (model.redirect_uri) this.redirect_uri = model.redirect_uri;
    if (model.post_logout_redirect_uri)
      this.post_logout_redirect_uri = model.post_logout_redirect_uri;
    if (model.silent_redirect_uri)
      this.silent_redirect_uri = model.silent_redirect_uri;
    if (model.response_type) this.response_type = model.response_type;
    if (model.scope) this.scope = model.scope;
    if (model.silent_renew) this.silent_renew = model.silent_renew;
  }
}
