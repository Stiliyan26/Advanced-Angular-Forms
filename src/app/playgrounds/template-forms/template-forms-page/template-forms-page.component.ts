import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInfo } from '../../../core/models/user-info';
import { BanWordsDirective } from '../validators/ban-words.directive';
import { PasswordShouldMatchDirective } from '../validators/password-should-match.directive';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BanWordsDirective,
    PasswordShouldMatchDirective
  ],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './template-forms-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateFormsPageComponent implements OnInit {

  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    yearOfBirth: 2022,
    passport: '',
    fullAddress: '',
    city: '',
    postCode: 0,
    password: '',
    confirmPassword: ''
  };

  constructor() { }

  get isAdult() {
    const currentYear = new Date().getFullYear();
    console.log('isAdult');

    console.log((currentYear - this.userInfo.yearOfBirth) >= 18);
    return (currentYear - this.userInfo.yearOfBirth) >= 18;
  }

  get bannedWordsForNickname(): string[] {
    console.log(this.isAdult ? ['test', 'test_test', 'dummy'] : []);

    return this.isAdult ? ['test', 'test_test', 'dummy'] : [];
  }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }
  

  ngOnInit(): void {
  }

  onSubmitForm(form: NgForm, e: SubmitEvent): void {
    console.log('The form has been submited', form.value);
    console.log('Native submit event', e);

  }
}