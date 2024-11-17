import { Directive, HostBinding, inject, OnDestroy, OnInit, StaticProvider } from "@angular/core";
import { AbstractControl, ControlContainer, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CONTROL_DATA } from "../control-data.token";
import { CommonModule, KeyValue } from "@angular/common";
import { DynamicControl } from "../models/dynamic-form.model";
import { banWords } from "../../reactive-forms/reactive-forms-page/validators/ban-words.validator";
import { DynamicValidatorMessageDirective } from "../../../core/dynamic-validator-message.directive";


export const comparatorFn = (
  a: KeyValue<string, DynamicControl>,
  b: KeyValue<string, DynamicControl>
): number => (a.value.order ?? 0) - (b.value.order ?? 0);

export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true })
}

export const sharedDynamicControlDeps = [
  CommonModule,
  ReactiveFormsModule,
  DynamicValidatorMessageDirective
];

@Directive()
export class BaseDynamicControl implements OnInit, OnDestroy {

  @HostBinding('class')
  hostClass = 'form-field';

  control = inject(CONTROL_DATA);

  formControl: AbstractControl = new FormControl(
    this.control.config.value,
    this.resolveValidators(this.control.config)
  );

  private parentGroupDir = inject(ControlContainer);

  ngOnInit(): void {
    if (this.parentGroupDir.control instanceof FormGroup) {
      (this.parentGroupDir.control as FormGroup).addControl(
        this.control.controlKey,
        this.formControl
      );
    }

    if (this.parentGroupDir.control instanceof FormArray) {
      this.parentGroupDir.control.push(this.formControl);
    }
  }

  ngOnDestroy(): void {
    if (this.parentGroupDir.control instanceof FormGroup) {
      (this.parentGroupDir.control as FormGroup).removeControl(
        this.control.controlKey,
      );
    }

    if (this.parentGroupDir.control instanceof FormArray) {
      const index = this.parentGroupDir.control.controls.indexOf(this.formControl);
      
      this.parentGroupDir.control.removeAt(index);
    }
  }

  private resolveValidators({ validators = {} }: DynamicControl) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map(validatorKey => {
      const validatorValue = validators[validatorKey];

      if (validatorKey === 'required') {
        return Validators.required;
      }

      if (validatorKey === 'email') {
        return Validators.email;
      }

      if (validatorKey === 'requiredTrue') {
        return Validators.requiredTrue;
      }

      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }

      if (validatorKey === 'banWords' && Array.isArray(validatorValue)) {
        return banWords(validatorValue);
      }

      return Validators.nullValidator;
    });
  }
}