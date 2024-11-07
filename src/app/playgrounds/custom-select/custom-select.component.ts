import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SelectComponent, SelectValue } from '../../custom-form-control/select/select.component';
import { OptionComponent } from '../../custom-form-control/option/option.component';
import { User } from '../../core/models/user';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, SelectComponent, OptionComponent, ReactiveFormsModule],
  templateUrl: './custom-select.component.html',
  styleUrls: [
    '../common-form.scss',
    './custom-select.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectComponent implements OnInit {

  selectValue: FormControl<SelectValue<User>> = new FormControl([
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
  ]);

  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom'),
    new User(5, 'Stephen Hawking', 'stephen', 'United Kingdom', true),
    new User(6, 'Max Planck', 'max', 'Germany'),
    new User(7, 'James Clerk Maxwell', 'james', 'United Kingdom'),
    new User(8, 'Michael Faraday', 'michael', 'United Kingdom'),
    new User(9, 'Richard Feynman', 'richard', 'USA'),
    new User(10, 'Ernest Rutherford', 'ernest', 'New Zealand'),
  ];

  filteredUsers = this.users;

  constructor(private cd: ChangeDetectorRef) { }

  @ViewChild(SelectComponent)
  select!: SelectComponent<User>;

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.select.open(); 
    // }, 3000);

    this.selectValue.valueChanges.subscribe(this.onSelectionChanged);
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
