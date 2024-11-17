import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

import { ControlInjectorPipe } from '../pipe/control-injector.pipe';
import { BaseDynamicControl, dynamicControlProvider } from './base-dynamic-control';
import { DynamicControl } from '../models/dynamic-form.model';
import { DynamicControlResolver } from '../service/dynamic-control-resolver.service';

@Component({
  selector: 'app-dynamic-array',
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
     <fieldset [formArrayName]="control.controlKey">
      <legend>{{control.config.label}}</legend>

      <ng-container *ngFor="let control of controls; let i = index">
        <ng-container
          [ngComponentOutlet]="controlResolver.resolve(control.controlType) | async"
          [ngComponentOutletInjector]="i | controlInjector:control">
        </ng-container>
      </ng-container>

      <button 
        *ngIf="control.config.interactive" 
        type="button" 
        (click)="addControl()">
        {{ control.config.interactive.buttonText || "Add Item"}}
      </button>
    </fieldset>
  `,
  styles: ``
})
export class DynamicArrayComponent extends BaseDynamicControl {

  @HostBinding('class')
  override hostClass = 'form-field-array';

  controlResolver = inject(DynamicControlResolver);

  override formControl = new FormArray([]);

  protected get controls() {
    return this.control.config.controls as DynamicControl[];
  }

  protected get interactive() {
    return this.control.config.interactive;
  }

  addControl() {
    if (this.interactive?.controlTemplate) {
      this.controls.push(this.interactive?.controlTemplate);
    }
  }
}
