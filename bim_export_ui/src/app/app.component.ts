import { Component, ViewContainerRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationsService } from './shared/services/notifications.service';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-element',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass','./app.component.css']
})

export class AppComponent implements OnChanges {
  @Input() public csiName: any;
  @Input() public userToken: any;
  @Input() public currentUser: any;
  @Input() public guid: any;
  @Input() public validationToken: any;

  title = 'BIM Export';

  public items: any[];

  constructor(private ds: DataService,
    notificationsService: NotificationsService,
    currentViewContainerRef: ViewContainerRef,
    // public apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    notificationsService.bindToContainer(currentViewContainerRef);
  }

  public logout() : void{
    this.authService.logout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ds.sendData(this.csiName);
  }
}
