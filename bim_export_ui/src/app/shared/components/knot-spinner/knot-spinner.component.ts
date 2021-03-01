import { Component, Input, ElementRef } from '@angular/core';

@Component({
//   moduleId: module.id,
  selector: 'knot-spinner',
  template: `
    <div *ngIf='active' class='spinner-container'>
      <img class='spinner1' src="https://content-server.s3.amazonaws.com/gordian/gordian-brand-assets/knot.svg" alt="">
    </div>
  `,
  styleUrls: ['knot-spinner.component.sass'],
})
export class KnotSpinnerComponent {
  private spinnerElement: HTMLElement;
  @Input() active: boolean = false;

  public constructor(elementRef: ElementRef) {}
}
