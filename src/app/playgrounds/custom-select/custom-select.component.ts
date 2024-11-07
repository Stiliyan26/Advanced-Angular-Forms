import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelectComponent, SelectValue } from '../../custom-form-control/select/select.component';
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

  selectValue: SelectValue<User> = [
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
  ];

  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom', true)
  ];

  filteredUsers = this.users;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  displayWithFn(user: User) {
    return user.name;
  }

  compareWithFn(user: User | null, user2: User | null) {
    return user?.id === user2?.id;
  }

  onSelectionChanged(value: unknown) {
    console.log('Selected value: ', value);
  }

  onSearchChanged(queryString: string) {

    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().startsWith(queryString.toLowerCase())
    );
  }
}
