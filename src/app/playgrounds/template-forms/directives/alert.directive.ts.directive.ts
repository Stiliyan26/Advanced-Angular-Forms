import { Directive } from '@angular/core';

@Directive({
  selector: '[appAlert]',
  standalone: true,
  exportAs: 'Alert'
})
export class AlertDirective {

  constructor() { }

}
