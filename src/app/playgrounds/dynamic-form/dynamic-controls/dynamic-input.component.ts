import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseDynamicControl, dynamicControlProvider } from './base-dynamic-control';


@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    dynamicControlProvider
  ],
  template: `
    <label [for]="control.controlKey">
      {{control.config.label}}
    </label>

    <input
      [formControlName]="control.controlKey"
      [id]="control.controlKey"
      [type]="control.config.type"
      [value]="control.config.value"
    >  
  `
})
export class DynamicInputComponent extends BaseDynamicControl {
}
