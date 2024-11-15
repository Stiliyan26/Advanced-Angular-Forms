import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { ValidationErrors } from '@angular/forms';
import { VALIDATION_ERROR_MESSAGES } from './validation-error-message.token';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let error of errors | keyvalue" class="input-error">
      {{ errorsMap[error.key](error.value) }}
    </div>
  `,
  styles: ``
})
export class InputErrorComponent {

  @Input()
  errors: ValidationErrors | undefined | null = null;

  protected errorsMap = inject(VALIDATION_ERROR_MESSAGES);
}
