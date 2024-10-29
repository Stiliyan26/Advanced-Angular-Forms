import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SelectComponent } from '../../custom-form-control/select/select.component';
import { OptionComponent } from '../../custom-form-control/option/option.component';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, SelectComponent, OptionComponent],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent {

  onSelectionChanged(value: string | null) {
    console.log('Selected value: ', value);
  }
}
