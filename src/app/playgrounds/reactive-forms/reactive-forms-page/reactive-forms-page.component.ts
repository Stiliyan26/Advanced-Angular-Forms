import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';

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
  years = this.getYears();
  skills$!: Observable<string[]>;
  //It is used to set a diffrent types
  // UntypeFormControl

  //When resetting the filed it will set the default value otherwise it will be empty
  // firstName: new FormControl<string>('Dmytro', { nonNullable: true }),

  form = new FormGroup({
    firstName: new FormControl<string>('Dmytro'),
    lastName: new FormControl('Mezhenskyi'),
    nickname: new FormControl(''),
    email: new FormControl('dmytro@decodedfrontend.io'),
    yearOfBirth: new FormControl(this.years[this.years.length -1], { nonNullable: true }),
    passport: new FormControl(''),
    address: new FormGroup({
      fullAddress: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      postCode: new FormControl(0, { nonNullable: true }),
    }),
    phones: new FormArray([
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
        phone: new FormControl('')
      })
    ])
  });


  constructor(private userSkills: UserSkillsService) { }

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills();
  }

  addPhone() {
    // this.form.controls.phones.push(new FormControl(''));

    //Specifies in wich index should the form control be added
    this.form.controls.phones.insert(0, this.addNewPhoneFormGroup());
  }

  removePhone(index: number) {
    this.form.controls.phones.removeAt(index);
  }

  private addNewPhoneFormGroup() {
    return new FormGroup({
      label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
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
