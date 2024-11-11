import { Directive, HostBinding, inject, StaticProvider } from "@angular/core";
import { FormGroup, ControlContainer } from "@angular/forms";
import { CONTROL_DATA } from "../control-data.token";


export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true })
}

@Directive()
export class BaseDynamicControl {

  @HostBinding('class')
  hostClass = 'form-field';

  control = inject(CONTROL_DATA);
}