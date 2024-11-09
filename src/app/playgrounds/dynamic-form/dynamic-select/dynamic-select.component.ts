import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CONTROL_DATA } from '../control-data.token';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select
          [id]="control.controlKey"
          [value]="control.config.value">

          <option *ngFor="let option of control.config.options"
            [value]="option.value">
            {{option.label}}
          </option> 
      </select>
  `,
  styleUrl: './dynamic-select.component.scss'
})
export class DynamicSelectComponent {

  control = inject(CONTROL_DATA);
}
