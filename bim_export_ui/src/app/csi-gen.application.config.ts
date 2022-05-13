import { Injectable } from '@angular/core';
import { IApplicationConfig, AuthConstantsConfig } from './shared/application.config';


@Injectable()
export class CSIGenAppConfig implements IApplicationConfig {
  public angularProdMode: boolean;
  public authority: string;
  public client_id: string;
  public applicationName: string;
  public applicationLogo: string;
  public zendeskUrl: string;
  public zendeskAnnouncementTags: string;
  public applicationId: number;
  public idleSessionTimeoutMins: number;
  public authConstants: AuthConstantsConfig;
  public securedConnections: Array<string> = [];
  public loginPage: string;
  public defaultPage: string;
  public localStoragePrefix: string;
  //delay between requests to avoid duplicates
  public timeOutBetweenRequests: number;
  public portalUrl: string;
  public googleTagManagerId: string = "";
  public reportsAppUrl: string;
  public commandCenterHomeUrl;
  public trackPageView: boolean;
  public eutaApiBaseUrl: string;
  public loginManagerUrl: string;
  public sentryKey: string;
  public showPerPage: number;
  public maxSize: number;
  public environment: string;
  public csiGenApiUrl: string;

  constructor() {
    //ToDo agree settings load with Sudhin
    var appConfig: any = window["appConfig"];
    if (!appConfig) {
      appConfig = {
        angularProdMode: false,
        authority: '',
        client_id: 'CSIGenUI',
        applicationId: 16,
        applicationName: 'CSIGen',
        applicationLogo: 'Content/images/navigation/gordian-logo-white.png',
        idleSessionTimeoutMins: 180,
        authConstants: {
            redirect_uri: window.location.protocol + "//" + window.location.host + "//csigen//auth",
            post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "//csigen//logout",
            silent_redirect_uri:window.location.protocol + "//" + window.location.host + "//blank.html",
            response_type: "id_token token",
            scope: "openid email profile roles",
            silent_renew: false
        },
        maxSize: 15,
        showPerPage: 50,
        environment: 'dev',
        loginPage: '/csigen/login',
        defaultPage: '/csigen/',
        localStoragePrefix: 'CSIGen',
        timeOutBetweenRequests: 900000,
        portalUrl: '',
        reportsAppUrl: '',
        commandCenterHomeUrl: '',      
        csiGenApiUrl: 'http://localhost:5000/api/',
      };
    };
    this.load(appConfig);
  }

  load(configuration: any) {
    this.angularProdMode = configuration.angularProdMode;
    this.authority = configuration.authority;
    this.client_id = configuration.client_id;
    this.csiGenApiUrl = configuration.csiGenApiUrl;
    this.applicationName = configuration.applicationName;
    this.applicationLogo = configuration.applicationLogo;
    this.applicationId = configuration.applicationId;
    this.idleSessionTimeoutMins = configuration.idleSessionTimeoutMins;
    if (configuration.authConstants) {
      this.authConstants = new AuthConstantsConfig(configuration.authConstants);
    }
    this.loginPage = configuration.loginPage;
    this.defaultPage = configuration.defaultPage;
    this.localStoragePrefix = configuration.localStoragePrefix;
    this.timeOutBetweenRequests = configuration.timeOutBetweenRequests;
    this.portalUrl = configuration.portalUrl;
    this.eutaApiBaseUrl = configuration.eutaApiBaseUrl;
    this.securedConnections = [this.portalUrl, this.csiGenApiUrl];
    this.commandCenterHomeUrl = configuration.commandCenterHomeUrl
  
    this.sentryKey = configuration.sentryKey;
    this.showPerPage = configuration.showPerPage;
    this.maxSize = configuration.maxSize;
    this.environment = configuration.environment;
  }
}
