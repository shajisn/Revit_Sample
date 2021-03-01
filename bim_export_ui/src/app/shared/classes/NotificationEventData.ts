import { NotificationTypes } from '../enums/notification.types';

export interface INotificationEventData {
    type: NotificationTypes;
    title?: string;
    description: string;
    html?: string;
    amount?: number;
    position?: string;
}