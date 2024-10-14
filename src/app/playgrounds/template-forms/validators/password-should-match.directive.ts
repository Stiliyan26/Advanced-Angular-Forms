import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordShouldMatch]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordShouldMatchDirective,
      multi: true
    }
  ]
})
export class PasswordShouldMatchDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl<string>): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirm-password');

    if (password?.value === confirmPassword?.value) {
      return null;
    }

    const error = { appPasswordShouldMatch: { mismatch: true } };

    confirmPassword?.setErrors(error);

    return error;
  }
}
