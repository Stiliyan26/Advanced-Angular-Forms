import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelectComponent } from '../../custom-form-control/select/select.component';
import { OptionComponent } from '../../custom-form-control/option/option.component';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, SelectComponent, OptionComponent],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent implements OnInit {

  selectValue = 'niels';

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.selectValue = 'marie';
      this.cd.markForCheck();
    }, 5000);
  }

  onSelectionChanged(value: string | null) {
    console.log('Selected value: ', value);
  }
}
