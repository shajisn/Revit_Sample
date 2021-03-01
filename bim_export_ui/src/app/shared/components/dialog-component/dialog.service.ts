import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from './dialog.component';
import { IDialogOptions, IPromisableDialogOptions } from "./dialogOptions";
import { IDialogService } from './idialog-service';

@Injectable()
export class DialogService implements IDialogService {
    private inactivate(): any {
        this._active = false;
    }
    constructor(private _modalService: NgbModal) {
    }
    private _active: boolean = false;

    public get active(): boolean {
        return this._active;
    }

    public show(options: IPromisableDialogOptions): Promise<any> {
        this._active = true;
        var ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            windowClass: 'gordian-modal'
        };
        const modalRef = this._modalService.open(DialogComponent, ngbModalOptions);
        modalRef.componentInstance.promisableDialogOptions = options;
        modalRef.componentInstance.onDismiss.subscribe(() => this.inactivate());
        return modalRef.result;
    }

    public showWithOptions(options: IDialogOptions): void {
        this._active = true;
        var ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            windowClass: 'gordian-modal'
        };
        const modalRef = this._modalService.open(DialogComponent, ngbModalOptions);
        modalRef.componentInstance.dialogOptions = options;
        modalRef.componentInstance.onDismiss.subscribe(() => this.inactivate());
    }
}