import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseDynamicControl, dynamicControlProvider } from './base-dynamic-control';


@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    dynamicControlProvider
  ],
  template: `
    <label [for]="control.controlKey">
      {{control.config.label}}
    </label>

    <select
        [formControlName]="control.controlKey"
        [id]="control.controlKey"
        [value]="control.config.value">

        <option *ngFor="let option of control.config.options"
          [value]="option.value">
          {{option.label}}
        </option> 
    </select>
  `
})
export class DynamicSelectComponent extends BaseDynamicControl {
}
