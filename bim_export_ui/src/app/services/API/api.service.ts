import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { JobOrder, TokenResp } from '../../models/models';

import { Observable, forkJoin } from 'rxjs';
import { retry, catchError, retryWhen, tap } from 'rxjs/operators';
import { AbstractAPIService } from '../../shared/services/abstract-api.service';
import { AuthService } from '../auth.service';
import { User } from 'oidc-client';
import { CSIGenAppConfig } from 'src/app/csi-gen.application.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService  extends AbstractAPIService {
  
  forge_token = "forge_token";
  job_order = "job_order";
  upload_file = "upload";
  export_excel = "export";
  download_link = "download";

  protected _endpoint: string;
  protected _applicationId: string;
  user_profile : User;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    }),
  }

  constructor(private http: HttpClient, 
    private appConfig: CSIGenAppConfig, 
    private authService: AuthService) {
    super();
    
    this._endpoint = `${appConfig.csiGenApiUrl}`;
    this._applicationId = `${appConfig.applicationId}`;
    
    this.user_profile = null;
    this.authService.getUser().then((user: User) => {
      if (user && user.access_token) {
        this.user_profile = user;
      } else {
        // throw new Error('user is not logged in');
        console.log("User is not legged in...")
      }
    });
    
  }

  token_api(): Observable<TokenResp> {
    console.log("Forge API Login ...");
    
    let body = JSON.stringify({});
    
    this.httpOptions.headers = this.httpOptions.headers.set("Authorization", 
      "Bearer "+ this.user_profile.access_token);
    let apiURL = `${this._endpoint}${this.forge_token}`;    
    return this.http.post<TokenResp>(apiURL, body, this.httpOptions)
      .pipe(
        catchError(
          (error: Response) => {
              return this.handleError(error);
          }
        )
      )
  }

  // Get predicted data
  get_job_orders(obj_id, filters): Observable<JobOrder> {
    let params = new HttpParams();
    params = params.append('limit', "25");
    if(obj_id){
      params = params.append("from", obj_id);
    }

    console.log("filters"+ JSON.stringify(filters));
    
    if(Object.keys(filters).length>0){
      if(filters.user_id.length>0){
        params = params.append("user_id", filters['user_id'][0]['filters'][0]['value']);
      }
      if(filters.date.length>0){
        params = params.append("date", filters['date'][0]['filters'][0]['value'].toString());
      }
      if(filters.description.length>0){
        console.log("description" + JSON.stringify(filters['description'][0]['filters'][0]['value']));
        params = params.append("description", filters['description'][0]['filters'][0]['value']);
      }
      if(filters.name.length>0){
        params = params.append("name", filters['name'][0]['filters'][0]['value']);
      }
    }
    
    this.httpOptions.headers = this.httpOptions.headers.set("Authorization", 
      "Bearer "+ this.user_profile.access_token);

    let apiURL = `${this._endpoint}${this.job_order}`;
    return this.http.get<JobOrder>(apiURL, { params: params,  headers : this.httpOptions.headers })
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  upload(formData): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data', 
        'Accept': 'application/json'
      }),
    }
    httpOptions.headers = httpOptions.headers.set("Authorization", "Bearer "+ this.user_profile.access_token);
      
    let apiURL = `${this._endpoint}${this.upload_file}`;
    return this.http.post<any>(apiURL, formData, {
      reportProgress: true,
      observe: 'events',
      headers : httpOptions.headers}).pipe(
        // retryWhen operator should come before catchError operator as it is more specific
        retryWhen(errors => errors.pipe(
          // inside the retryWhen, use a tap operator to throw an error 
          // if you don't want to retry
          tap(error => {
            if (error.status !== 500 && error.status !== 502) {
              throw error;
            }
          })
        )),
        catchError(this.handleError)
      )
  }

  export(job_name): Observable<any> {

    let body = JSON.stringify({'job_name': job_name});

    let params = new HttpParams();
    params = params.append("job_name", job_name);

    this.httpOptions.headers = this.httpOptions.headers.set("Authorization", "Bearer "+ this.user_profile.access_token);

    let apiURL = `${this._endpoint}${this.export_excel}`;
    return this.http.post<any>(apiURL, body, { params: params,  headers : this.httpOptions.headers })
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  get_download_url(file_id): Observable<any> {

    let params = new HttpParams();
    params = params.append("file_id", file_id);

    this.httpOptions.headers = this.httpOptions.headers.set("Authorization", "Bearer "+ this.user_profile.access_token);

    let apiURL = `${this._endpoint}${this.download_link}`;
    return this.http.get<any>(apiURL, { params: params,  headers : this.httpOptions.headers })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getJSON(url): Observable<any> {
    return this.http.get<any>(url)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
 
}