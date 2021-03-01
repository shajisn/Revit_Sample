import { IPromisableDialogOptions, IDialogOptions } from "./dialogOptions";

export interface IDialogService {
    show(options: IPromisableDialogOptions): Promise<any>;
    showWithOptions(options: IDialogOptions): void;
}