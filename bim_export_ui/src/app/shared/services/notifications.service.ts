import { Injectable, ViewContainerRef } from '@angular/core';
import { EventsService } from './events.service';
import { INotificationEventData } from "./NotificationEventData";
import { CurrencyPipe } from '@angular/common';
import { EventNames } from '../enums/event.names';
import { NotificationTypes } from '../enums/notification.types';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationsService {
    private initialized: boolean = false;
    private PADDING: string = "000000";
    private decimalSeparator: string = '.';
    private thousandsSeparator: string = ',';
    private decimalPoints: number = 2;

    constructor(private toastr: ToastrService,  private readonly _eventsService: EventsService) {
        this._eventsService.on(EventNames.showNotification, (event, data: INotificationEventData) => {
            var description = `<div>${data.description}</div>`;
            if (data.amount !== undefined) {
                var amount = (new CurrencyPipe("en-US")).transform(data.amount, "USD", true, '.2-2');
                description += `<div>Amount: ${amount}</div>`;
            }
            if (data.position !== undefined) {
                  //this.toastOptions.positionClass = data.position;
            }
            if (this.initialized) {
                switch (data.type) {
                    case NotificationTypes.Success:
                        this.toastr.success(description, data.title || 'Success!', { enableHtml: true });
                        break;
                    case NotificationTypes.Error:
                        this.toastr.error(description, data.title || 'Error!', { enableHtml: true })
                        break;
                    case NotificationTypes.Info:
                        this.toastr.info(description, data.title || 'Info!', { enableHtml: true })
                        break;
                    case NotificationTypes.Warning:
                        this.toastr.warning(description, data.title || 'Warning!', { enableHtml: true })
                        break;
                    case NotificationTypes.Custom:
                        //this.toastr.custom(data.description, null, { enableHTML: true })
                        break;
                }
            };
        });
    }

    public bindToContainer(vcr: ViewContainerRef) {
        //this.toastr.setRootViewContainerRef(vcr);
        this.initialized = true;
    }
}
