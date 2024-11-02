import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelectComponent } from '../../custom-form-control/select/select.component';
import { OptionComponent } from '../../custom-form-control/option/option.component';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, SelectComponent, OptionComponent],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectComponent implements OnInit {

  selectValue = 'niels';
  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom', true)
  ];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.selectValue = 'marie';

      this.users = [
        new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
        new User(2, 'Niels Bohr', 'niels', 'Denmark'),
        new User(3, 'Marie Curie', 'marie', 'Poland/French'),
      ];
      
      this.cd.markForCheck();
    }, 5000);
  }

  onSelectionChanged(value: unknown) {
    console.log('Selected value: ', value);
  }
}
