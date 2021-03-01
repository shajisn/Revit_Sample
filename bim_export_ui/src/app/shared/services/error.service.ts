import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import * as Raven from 'raven-js';

import { CSIGenAppConfig } from '../../csi-gen.application.config';

@Injectable()
export class ErrorService implements IErrorService {
    public prodMode: boolean = false;
    constructor(readonly appConfig: CSIGenAppConfig, readonly router: Router) {
        this.prodMode = (appConfig && appConfig.angularProdMode);
    }

    public errorHandler(errorResponse) {
        switch (errorResponse.status) {
            case 400:
                return this.processError(((errorResponse.data && errorResponse.data.message) ? errorResponse.data.message : ''), 'http-error-400', 400, errorResponse);
            case 401:
                //this._rsmpRootScope.UserDetails = new UserDetailsResponse();
                //this.router.navigate([this.appConfig.defaultPage + "accessdenied"]);
                return this.processError('Wrong authorization', 'http-error-401', 401, errorResponse);
            case 403:
                return this.processError('You have insufficient privileges', 'http-error-403', 403, errorResponse);
            case 404:
                return this.processError('Bad request', 'http-error-404', 404, errorResponse);
            case 500:
                return this.processError('Internal server error: ' + ((errorResponse.data && errorResponse.data.message) ? errorResponse.data.message : ''), 'http-error-500', 500, errorResponse);
            default:
                return this.processError('Error ', 'http-error-common' + errorResponse.status, 1, errorResponse);
        }
    };

    public errorHandlerAsObservable(errorResponse) {
        this.errorHandler(errorResponse);
        return Observable.throw("");
    }

    public log(errorResponse, errorObject?) {
        console.log(errorResponse, errorObject);
    }

    public warn(...warning) {
        if (!this.prodMode) console.log(warning);
    }

    public debug(...debug) {
        if (!this.prodMode) console.log(debug);
    }

    private processError(userFriendlyMessage, systemMessage, code, errorObj) {
        if (!this.prodMode)
            console.log(userFriendlyMessage, systemMessage, code);

        if (Raven.isSetup())
            Raven.captureException(errorObj);

    }
}

export interface IErrorService {
    prodMode: boolean;
    errorHandler(errorResponse: any);
    errorHandlerAsObservable(errorResponse: any);
    log(errorResponse: any, errorObject?: any);
    warn(...warning: any[]);
    debug(...debug: any[]);
}