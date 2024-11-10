import { Directive, HostBinding, inject } from "@angular/core";
import { FormGroup, ControlContainer } from "@angular/forms";
import { CONTROL_DATA } from "../control-data.token";

@Directive()
export class BaseDynamicControl {

  @HostBinding('class')
  hostClass = 'form-field';

  control = inject(CONTROL_DATA);

  get formGroup() {
    return this.parentFormGroup.control as FormGroup;
  }

  private parentFormGroup = inject(ControlContainer);
}