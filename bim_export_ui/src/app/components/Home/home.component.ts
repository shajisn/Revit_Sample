import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/API/api.service';
import { JobOrder, SortColumn, SortDirection, SortEvent } from 'src/app/models/models';
import { AlertService } from 'src/app/shared/components/Alert/alert.service';
import { createTrue } from 'typescript';

@Component({
  selector: 'app-results',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass', './home.component.css']
})
export class HomeComponent implements OnInit {

  public job_orders: JobOrder[];

  public isLoading: boolean = false;

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  
  constructor(public apiService: ApiService,
    public route: ActivatedRoute,
    public alertService: AlertService) {
      
    }

  ngOnInit(): void {
    this.isLoading = true;
    // let token_resp = this.apiService.token_api().toPromise();
    let filter_params = {};
    this.apiService.get_job_orders(null, filter_params).subscribe((resp: any) => {
      this.job_orders = resp.map(item => new JobOrder(        
        item._id, 
        item.name,
        item.description,
        item.export_status,
        item.gracie_status,
        item.gracie_url, 
        item.upload_file_name, 
        item.upload_file_id,
        item.upload_status,
        item.revit_url,
        encodeURIComponent(item.forge_doc_id), 
        item.forge_status,
        item.forge_bucket_name, 
        item.json_file_id, 
        item.json_file_name,
        item.json_url,
        item.user_id,
        item.created_time, 
        item.modified_time,
        item.error_message));
      this.isLoading = false;
    },
    error => {
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
      this.isLoading = false; 
    });
  }

  onSort({column, direction}: SortEvent) {
  }

  download_json(file_id, file_name){
    this.isLoading = true; 

    this.apiService.get_download_url(file_id).subscribe((resp: any) => {
      console.log("Generate download url for file " + file_id + " response: " + resp['download_url']);
      this.apiService.getJSON(resp['download_url']).subscribe( (resp: any) => {
        console.log("Downloaded JSON " + resp)
        var sJson = JSON.stringify(resp);
        var element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
        element.setAttribute('download', file_name);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
        this.alertService.info('Download complete ...', this.options);
        this.isLoading = false; 
      },
      error => {
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
        this.isLoading = false; 
      });
    });
  }
}
