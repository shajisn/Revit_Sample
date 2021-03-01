// import { Headers, RequestOptions } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export abstract class AbstractAPIService {
    protected _endpoint: string;

    // protected headers = new Headers({ 'Content-Type': 'application/json' });
    // protected options = new RequestOptions({ headers: this.headers });

    protected handleError(error: any) {
        console.log(error);
        return Observable.throw(error);
    }

    protected handleErrorPromise(error: any) {
        console.log(error);
        return Promise.reject(error);
    }

    protected handleErrorSilent() {
        // return Observable.of(null);
    }
};
