import { Component } from '@angular/core';

import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [
    ...sharedDynamicControlDeps
  ],
  viewProviders: [
    dynamicControlProvider
  ],
  template: `
    <input 
      [formControlName]="control.controlKey"
      type="checkbox"
      [checked]="control.config.value"
      [id]="control.controlKey">

    <label [for]="control.controlKey">
      {{control.config.label}}
    </label>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
  `],
})
export class DynamicCheckboxComponent extends BaseDynamicControl {
}
