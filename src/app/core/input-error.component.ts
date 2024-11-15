import { CommonModule, KeyValue } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { ValidationErrors } from '@angular/forms';
import { VALIDATION_ERROR_MESSAGES } from './validation-error-message.token';
import { ErrorMessagePipe } from './error-message.pipe';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule, ErrorMessagePipe],
  template: `
    <div *ngFor="let error of errors | keyvalue; trackBy: trackByFn" class="input-error">
      {{ error.key | errorMessage: error.value }}
    </div>
  `,
  styles: ``
})
export class InputErrorComponent {

  @Input()
  errors: ValidationErrors | undefined | null = null;

  trackByFn(index: number, item: KeyValue<string, any>) {
    return item.key
  }
}
