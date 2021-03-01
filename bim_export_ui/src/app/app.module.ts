import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementRef, NgModule, Injector  } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule, APP_BASE_HREF, Location } from '@angular/common';
import { Router } from '@angular/router';
import { createCustomElement } from "@angular/elements"

import { ToastrModule } from 'ngx-toastr';
// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KnotSpinnerComponent } from './shared/components/knot-spinner/knot-spinner.component';
import { ApiService } from './services/API/api.service';
import { CSIGenAppConfig } from './csi-gen.application.config';
import { DialogService } from './shared/components/dialog-component/dialog.service';
// import { ModalModule } from 'ngx-bootstrap';
import { DialogComponent } from './shared/components/dialog-component/dialog.component';
import { DataService } from './data.service';
import { ErrorService } from './shared/services/error.service';
import { EventsService } from './shared/services/events.service';
import { NotificationsService } from './shared/services/notifications.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UploadComponent } from './components/upload/upload.component';

import { ViewerModule } from 'ng2-adsk-forge-viewer';
import { HomeComponent } from './components/Home/home.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { AlertModule } from './shared/components/Alert';

@NgModule({
  declarations: [
    AppComponent,
    KnotSpinnerComponent,
    DialogComponent,
    UploadComponent,
    HomeComponent,
    ViewerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    ViewerModule,
    AlertModule,
    // ModalModule.forRoot(),
    ToastrModule.forRoot(),
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      "backgroundColor": "#FFFFFF",
      "radius": 10,
      "maxPercent": 200,
      "unitsColor": "#483500",
      "outerStrokeWidth": 8,
      "outerStrokeColor": "#faae82",
      "innerStrokeColor": "#FFFFFF",
      "titleColor": "#483500",
      "titleFontSize": "12",
      "titleFontWeight": "200",
      "unitsFontSize": "10",
      "unitsFontWeight": "200",
      "subtitleColor": "#483500",
      "subtitleFontWeight": "200",
      "showSubtitle": false,
      "showInnerStroke": false,
      "showBackground": false,
      "clockwise": true,
      "startFromZero": false
    }),
  ],
  providers: [
    ErrorService,
    ApiService,
    CSIGenAppConfig,
    DatePipe,
    EventsService,
    DialogService,
    NotificationsService,
    DataService,
    AuthGuardService, 
    AuthService,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  entryComponents: [AppComponent]
})

export class AppModule {
  constructor(private injector: Injector, private router: Router, private location: Location) {
    // Create custom angular element
    const csiElement = createCustomElement(AppComponent, { injector });
    if (!customElements.get('app-element')) {
      customElements.define('app-element', csiElement);
    }

    this.router.navigateByUrl(this.location.path(false), { skipLocationChange: true });
  }
  ngDoBootstrap() { 
    // 
  }
}
