import { EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { IDialogOptions, IPromisableDialogOptions } from "./dialogOptions";

@Component({
    // moduleId: module.id,
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.sass']
})

export class DialogComponent implements OnInit {

    @Output() onDismiss = new EventEmitter();

    ngOnInit(): void {
        if (this.dialogOptions && this.promisableDialogOptions) {
            throw new Error("You cannot use both options at the same time.");
        }
        if (this.dialogOptions) {
            this.useDefaultButtons = false;
            this.title = this.dialogOptions.title;
            if (typeof this.dialogOptions.message === 'string') {
                this.message = this.dialogOptions.message;
            }
            else {
                this.dialogOptions.message.subscribe(message => this.message = message);
            }
            this.isHtml = this.dialogOptions.isHtml !== undefined ? this.dialogOptions.isHtml : false;
            this.displayClose = this.dialogOptions.displayClose !== undefined ? this.dialogOptions.displayClose : true;
        }
        else if (this.promisableDialogOptions) {
            this.title = this.promisableDialogOptions.title;
            this.message = this.promisableDialogOptions.message;
            this.isHtml = this.promisableDialogOptions.isHtml !== undefined ? this.promisableDialogOptions.isHtml : false;;
            this.displayClose = this.promisableDialogOptions.displayClose !== undefined ? this.promisableDialogOptions.displayClose : true;
            this.cancelButtonText = this.promisableDialogOptions.cancelButtonText || 'Cancel';
            this.okButtonText = this.promisableDialogOptions.okButtonText || 'OK';
        }
    }
    public title: string;
    public message: string;
    public isHtml: boolean;
    public dialogOptions: IDialogOptions = null;
    public promisableDialogOptions: IPromisableDialogOptions = null;
    public useDefaultButtons: boolean = true;
    public actionInProgress: boolean = false;
    public displayClose: boolean;
    public cancelButtonText: string;
    public okButtonText: string;

    constructor(public modalService: NgbModal, public activeModal: NgbActiveModal) {
    }

    doAction(action?: () => Promise<any> | Observable<any> | boolean) {
        if (this.actionInProgress) {
            return;
        }
        this.actionInProgress = true;
        this.closeIfSuccessful(action);
    }

    public closeIfSuccessful(callback: () => Promise<any> | Observable<any> | boolean) {
        if (!callback) {
            return this.dismiss();
        }
        let response = callback();
        if (typeof response === 'boolean') {
            if (response) {
                return this.dismiss();
            }
        }
        if (response instanceof Promise) {
            // response = Observable.fromPromise(<Promise<any>>response);
        }
        (response as Observable<any>).subscribe(() => {
            this.dismiss();
        });
    }

    public dismiss() {
        this.actionInProgress = false;
        this.activeModal.close(true)
        this.onDismiss.emit();
    }

    public close() {
        if (this.actionInProgress) return;
        this.actionInProgress = false;
        this.activeModal.close(false)
        this.onDismiss.emit();
    }
}