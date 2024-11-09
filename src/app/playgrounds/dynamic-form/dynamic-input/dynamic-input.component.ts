import { Component, inject } from '@angular/core';
import { CONTROL_DATA } from '../control-data.token';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [],
  template: `
    <input 
      [id]="control.controlKey"
      [type]="control.config.type"
      [value]="control.config.value"
    >  
  `,
  styleUrl: './dynamic-input.component.scss'
})
export class DynamicInputComponent {
  
  control = inject(CONTROL_DATA);
}
