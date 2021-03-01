import { Observable } from "rxjs/Observable";

export interface IDialogOptions {
    title?: string,
    message: string | Observable<string>,
    isHtml?: boolean,
    displayClose?: boolean,
    actionButtons?: IDialogButtons[];
}

export interface IPromisableDialogOptions {
    title?: string,
    message: string,
    isHtml?: boolean,
    displayClose?: boolean,
    cancelButtonText?: string,
    okButtonText?: string
}

export interface IDialogButtons {
    text: string;
    buttonClass?: string;
    onAction?: () => Promise<any> | Observable<any> | boolean;
}