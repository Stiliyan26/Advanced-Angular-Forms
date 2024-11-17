import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInfo } from '../../../core/models/user-info';
import { BanWordsDirective } from '../validators/ban-words.directive';
import { PasswordShouldMatchDirective } from '../validators/password-should-match.directive';
import { UniqueNicknameDirective } from '../validators/unique-nickname.directive';

import { DynamicValidatorMessageDirective } from '../../../core/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from '../../../core/validator-message-container.directive';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BanWordsDirective,
    PasswordShouldMatchDirective,
    UniqueNicknameDirective,
    DynamicValidatorMessageDirective,
    ValidatorMessageContainerDirective
  ],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './template-forms-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateFormsPageComponent implements OnInit, AfterViewInit {

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

  @ViewChild(NgForm) 
  formDir!: NgForm;

  private inialFormValues: unknown;

  constructor() { }

  get isAdult() {
    const currentYear = new Date().getFullYear();

    return (currentYear - this.userInfo.yearOfBirth) >= 18;
  }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.inialFormValues = this.formDir.value;
    });
  }

  onSubmitForm(e: SubmitEvent): void {
    // Strategy 1 - Reset form values, validation statuses, making controls untouched, pristine, etc
    // form.resetForm();
    // form.resetForm();
    // Strategy 2 - Reset only control statuses but not values.
    //  form.resetForm({
    //   'first-name': form.controls['first-name'].value
    //  });

    if (this.formDir.invalid) return;

    this.formDir.resetForm(this.formDir.value);
    this.inialFormValues = this.formDir.value;                                                    
    // console.log('The native submit event', e);
  }

  modelChanged(value: string) {
    this.userInfo.firstName = value;
  }

  onReset(e: Event) {
    e.preventDefault();

     this.formDir.resetForm(this.inialFormValues);
  }
}