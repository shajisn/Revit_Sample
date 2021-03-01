import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'

import {
  ViewerOptions,
  ViewerInitializedEvent,
  DocumentChangedEvent,
  SelectionChangedEventArgs,
  Extension,
} from 'ng2-adsk-forge-viewer';
import { ForgeExtension } from './forgeExtension';
import { ApiService } from 'src/app/services/API/api.service';
import { TokenResp } from 'src/app/models/models';
import { AlertService } from 'src/app/shared/components/Alert/alert.service';

// export const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsImJ1Y2tldDpjcmVhdGUiLCJidWNrZXQ6cmVhZCIsImJ1Y2tldDp1cGRhdGUiLCJidWNrZXQ6ZGVsZXRlIl0sImNsaWVudF9pZCI6IndHNmlxMjNkRTVGNnNJbnBlTjBhMzNKMWwweDVxM3V2IiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoiaWpRUkFOb0NKVkJUaG1kQzRDaWpJbWhZVWdFdmwxZEgzbERsSXM0N0lYWWFsRVRROHlWNHRVS2dFdUQ5Nnl6MSIsImV4cCI6MTYxMTA3MzU3Mn0.a2xvwLZxCtrF3WCwB1eoOsWbcefP6qvpFjOaBkqAu7U";
// export const DOCUMENT_URN = btoa('urn:adsk.objects:os.object:wg6iq23de5f6sinpen0a33j1l0x5q3uv_tutorial_bucket/rac_advanced_sample_project.rvt');

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent  {
  public viewerOptions: ViewerOptions;
  public documentId: string;
  public isLoading: boolean = false;

  private history: string[] = []
  forgeToken: string;
  jobName: string;
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
    this.forgeToken = '';
  }
 
  public ngOnInit() {
    this.isLoading = true;
    this.jobName = decodeURIComponent(this.route.snapshot.queryParams["job_name"]);
    let doc_urn = decodeURIComponent(this.route.snapshot.queryParams["doc_urn"]);
    console.log( "URN = " + doc_urn)
    
    doc_urn = btoa(doc_urn)
    console.log( "DECODED URN = " + doc_urn)

    this.apiService.token_api().subscribe((token_resp: TokenResp) => {
      this.forgeToken = token_resp.access_token;
      console.log("Token = " + this.forgeToken);

      this.viewerOptions = {
        initializerOptions: {
          env: "AutodeskProduction",
          getAccessToken: (
            onGetAccessToken: (token: string, expire: number) => void
          ) => {
            const expireTimeSeconds = 60 * 60;
            onGetAccessToken(this.forgeToken, expireTimeSeconds);
          },
          api: "derivativeV2",
          enableMemoryManagement: true
        },
        viewerConfig: {
          extensions: ["Autodesk.DocumentBrowser", ForgeExtension.extensionName],
          theme: "bim-theme"
        },
        onViewerScriptsLoaded: () => {
          // Register a custom extension
          Extension.registerExtension(ForgeExtension.extensionName, ForgeExtension);
        },
        onViewerInitialized: (args: ViewerInitializedEvent) => {
          args.viewerComponent.DocumentId = doc_urn;
        },
        showFirstViewable: true,
        // headlessViewer: true,
      };

      console.log("Loading forge viewer ...")
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

  public selectionChanged(event: SelectionChangedEventArgs) {
    const { document } = event;
    if (!document.getRoot()) 
      return;

    const viewables = document.getRoot().search({ type: 'geometry', role: '3d' });
    if (viewables && viewables.length > 0) {
      event.viewerComponent.loadDocumentNode(document, viewables[0]);
    }
  }

  public back(): void {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl('/')
    }
  }

  export(): void {
    this.isLoading = true;
    this.apiService.export(this.jobName).subscribe((resp: any) => {
      this.alertService.info("Export process initiated.", this.options);
      this.isLoading = false;
      setTimeout(() => {
        this.back();
      }, 1500);
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
}
