import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseDynamicControl, dynamicControlProvider } from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  `]
})
export class DynamicCheckboxComponent extends BaseDynamicControl {
}
