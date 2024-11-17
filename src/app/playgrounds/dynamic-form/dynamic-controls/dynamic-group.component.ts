import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { BaseDynamicControl, comparatorFn, dynamicControlProvider } from './base-dynamic-control';
import { ControlInjectorPipe } from '../pipe/control-injector.pipe';
import { DynamicControlResolver } from '../service/dynamic-control-resolver.service';
import { DynamicFormConfig } from '../models/dynamic-form.model';


@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ControlInjectorPipe
  ],
  viewProviders: [
    dynamicControlProvider
  ],
  template: `
    <fieldset [formGroupName]="control.controlKey">
      <legend>{{control.config.label}}</legend>

      <ng-container *ngFor="let control of controls | keyvalue: comparatorFn">
        <ng-container
          [ngComponentOutlet]="controlResolver.resolve(control.value.controlType) | async"
          [ngComponentOutletInjector]="control.key | controlInjector:control.value">
        </ng-container>
      </ng-container>
    </fieldset>
  `,
  styles: ``
})
export class DynamicGroupComponent extends BaseDynamicControl {

  @HostBinding('class')
  override hostClass = '';

  controlResolver = inject(DynamicControlResolver);

  override formControl = new FormGroup({});
  
  protected comparatorFn = comparatorFn;

  protected get controls() {
    return this.control.config.controls as DynamicFormConfig['controls'];
  }
}
