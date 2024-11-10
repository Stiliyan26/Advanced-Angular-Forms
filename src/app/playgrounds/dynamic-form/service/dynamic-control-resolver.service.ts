import { T } from '@angular/cdk/keycodes';
import { Injectable, Type } from '@angular/core';

import { DynamicControl } from '../models/dynamic-form.model';

import { DynamicInputComponent } from '../dynamic-controls/dynamic-input.component';
import { DynamicSelectComponent } from '../dynamic-controls/dynamic-select.component';
import { DynamicCheckboxComponent } from '../dynamic-controls/dynamic-checkbox.component';


type DynamicControlMap = {
  [T in DynamicControl['controlType']]: Type<any>;
};

@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolver {

  private controlComponent: DynamicControlMap = {
    input: DynamicInputComponent,
    select: DynamicSelectComponent,
    checkbox: DynamicCheckboxComponent
  }

  resolve(controlType: keyof DynamicControlMap) {
    return this.controlComponent[controlType];
  }
} 