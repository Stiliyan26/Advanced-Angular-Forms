import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './reactive-forms-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveFormsPageComponent implements OnInit {

  phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];

  form = new FormGroup({
    firstName: new FormControl('Dmytro'),
    lastName: new FormControl('Mezhenskyi'),
    nickname: new FormControl(''),
    email: new FormControl('dmytro@decodedfrontend.io'),
    yearOfBirth: new FormControl(1983),
    passport: new FormControl(''),
    address: new FormGroup({
      fullAddress: new FormControl(''),
      city: new FormControl(''),
      postCode: new FormControl(0),
    }),
    phones: new FormArray([
      this.addNewPhoneFormGroup()
    ])
  });

  years = this.getYears();

  constructor() { }

  ngOnInit(): void {
  }

  addPhone() {
    // this.form.controls.phones.push(new FormControl(''));

    //Specifies in wich index should the form control be added
    this.form.controls.phones.insert(0, this.addNewPhoneFormGroup());
  }

  removePhone(index: number) {
    this.form.controls.phones.removeAt(index);
  }

  addNewPhoneFormGroup() {
    return new FormGroup({
      label: new FormControl(this.phoneLabels[0]),
      phone: new FormControl('')
    });
  }

  onSubmit(e: Event) {
    console.log(this.form.value);
  }

  private getYears() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }
}
