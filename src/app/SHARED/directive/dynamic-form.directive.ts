import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[DynamicFrom]',
    standalone: false
})
export class DynamicFormDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }


}
