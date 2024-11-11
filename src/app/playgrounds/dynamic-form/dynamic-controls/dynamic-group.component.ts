import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseDynamicControl, comparatorFn, dynamicControlProvider } from './base-dynamic-control';
import { ControlInjectorPipe } from '../pipe/control-injector.pipe';
import { DynamicControlResolver } from '../service/dynamic-control-resolver.service';


@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe],
  viewProviders: [
    dynamicControlProvider
  ],
  template: `
    <fieldset [formGroupName]="control.controlKey">
      <legend>{{control.config.label}}</legend>

      <ng-container *ngFor="let control of control.config.controls | keyvalue: comparatorFn">
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
  
  protected comparatorFn = comparatorFn;

  @HostBinding('class')
  override hostClass = '';

  controlResolver = inject(DynamicControlResolver);
}
