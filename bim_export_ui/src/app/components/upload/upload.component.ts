import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'
import { ApiService } from 'src/app/services/API/api.service';

import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { AlertService } from 'src/app/shared/components/Alert/alert.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent  {
  
  public isLoading: boolean = false;

  old_name: string;
  old_descr: string;
  old_revit: string;

  job_name: string;
  job_description: string;
  is_update: boolean = false;
  enable_editing: boolean = false;
  progress: number = 0;
  revitFileName: string = "";
   
  private history: string[] = []

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files = [];  

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
    
  constructor(public apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public alertService: AlertService,    
    private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
  }  

  ngOnInit(): void {
    
    if(this.route.snapshot.queryParams["job_name"]) {
      this.job_name = decodeURIComponent(this.route.snapshot.queryParams["job_name"]);
      this.is_update = true;
      this.enable_editing = false;
    }
    else {
      this.is_update = false;
      this.enable_editing = true;
    }
    if(this.route.snapshot.queryParams["job_description"])
      this.job_description = decodeURIComponent(this.route.snapshot.queryParams["job_description"]);
    if(this.route.snapshot.queryParams["file_name"])
      this.revitFileName = decodeURIComponent(this.route.snapshot.queryParams["file_name"]);
    
    this.old_name = this.job_name;
    this.old_descr = this.job_description;
    this.old_revit = this.revitFileName;
  }

  back(): void {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    }
    else {
      this.router.navigateByUrl('/')
    }
  }

  uploadFile(file) {  
    if(this.job_name == null) {
      this.alertService.error("Please provide a Job name.", this.options);
      return;
    }
    
    this.isLoading = true;

    this.revitFileName = file.data.name;
    console.log("Uploading file ..." + file + " Job name = " + this.job_name)
    const formData = new FormData();  
    formData.append('revitFile', file.data);  
    formData.append('jobname', this.job_name);  
    formData.append('description', this.job_description);  
    formData.append('is_update', this.is_update + "");

    file.inProgress = true;

    this.apiService.upload(formData).pipe(  
      map(event => {  
        console.log('Event = ' + event.type);
        switch (event.type) { 
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            this.isLoading = false;
            console.log('File successfully uploaded!', event.body);
            // 
            this.alertService.info("File uploaded succesfully");
            setTimeout(() => {
              this.progress = 0;
              this.files = [];
              this.back();
            }, 3000);
        }  
      }),  
      catchError((error: HttpErrorResponse) => { 
        console.log('Error status = ' + error);
        let error_message = "An unexpected error occurred while processing your request.";
        if (error.status == 500) {
          this.alertService.error(error_message, this.options);
        }
        else {
          if (error.error.message || error.error.details)
            error_message =  error.error.message ? error.error.message : error.error.details
          console.log("Error = " + error_message);
          this.alertService.error(error_message, this.options);
        }
        
        this.files = [];
        this.progress = 0; 
        this.isLoading = false;
        return of(`${file.data.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body);  
        }  
      },
      error => {
        this.progress = 0; 
        this.isLoading = false;
        this.files = [];
        this.alertService.error(error.error.message ? error.error.message : error.error.details);
      });  
  }

  private uploadFiles() {  
    console.log("Uploading files ...")
    this.fileUpload.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.uploadFile(file);  
    });  
  }

  onClick() {  
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {  
      for (let index = 0; index < fileUpload.files.length; index++) {  
        console.log("File index = " + index)
        const file = fileUpload.files[index];  
        this.files.push({ data: file, inProgress: false, progress: 0});  
      }  
      this.uploadFiles();  
    };  
    fileUpload.click();  
  }

  enable_edit() {
    this.enable_editing = !this.enable_editing;
    if(!this.enable_editing){
      this.job_name = this.old_name;
      this.job_description = this.old_descr;
      this.revitFileName = this.old_revit;
    }
  }
}
