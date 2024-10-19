import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, startWith, Subscription, tap } from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';
import { banWords } from './validators/ban-words.validator';
import { passwordShouldMatch } from './validators/password-should-match.validator';

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
export class ReactiveFormsPageComponent implements OnInit, OnDestroy {

  phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];
  years = this.getYears();
  skills$!: Observable<string[]>;

  private fb = inject(FormBuilder);
  private userSkills = inject(UserSkillsService);
  private ageValidators!: Subscription;

  form = this.fb.group({
    firstName: ['Dmytro', [
      Validators.required,
      Validators.minLength(2),
      banWords(['test', 'dummy'])
    ]],
    lastName: ['Mezhenskyi', [
      Validators.required,
      Validators.minLength(2)
    ]],
    nickname: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\w.]+$/)
    ]],
    email: ['dmytro@decodedfrontend.io', Validators.email],
    yearOfBirth: this.fb.nonNullable.control(this.years[this.years.length - 1], Validators.required),
    passport: ['', Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)],
    address: this.fb.nonNullable.group({
      fullAddress: ['', Validators.required],
      city: ['', Validators.required],
      postCode: [0, Validators.required],
    }),
    phones: this.fb.array([
      this.fb.group({
        label: this.fb.nonNullable.control(this.phoneLabels[0]),
        phone: ''
      })
    ]),
    skills: this.fb.record<boolean>({}),
    password: this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6)]
      ],
      confirmPassword: ''
    }, {
      validators: passwordShouldMatch
    })
  });

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills().pipe(
      tap(skills => this.buildSkillControls(skills))
    );

    this.ageValidators = this.form.controls.yearOfBirth.valueChanges
      .pipe(
        tap(() => this.form.controls.passport.markAsDirty()),
        startWith(this.form.controls.yearOfBirth.value)
      )
      .subscribe(
        yearOfBirth => {
          this.isAdult(yearOfBirth)
            ? this.form.controls.passport.addValidators(Validators.required)
            : this.form.controls.passport.removeValidators(Validators.required);

          this.form.controls.passport.updateValueAndValidity();
        }
      );
  }

  ngOnDestroy(): void {
    this.ageValidators.unsubscribe();
  }

  addPhone() {
    this.form.controls.phones.insert(0,
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
        phone: new FormControl('')
      })
    );
  }

  removePhone(index: number) {
    this.form.controls.phones.removeAt(index);
  }

  onSubmit(e: Event) {
    console.log(this.form.value);
  }

  private getYears() {
    const now = new Date().getUTCFullYear();

    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  private buildSkillControls(skills: string[]) {
    skills.forEach(skill =>
      this.form.controls.skills.addControl(
        skill,
        new FormControl(false, { nonNullable: true })
      )
    );
  }

  private isAdult(yearOfBirth: number): boolean {
    const currentYear = new Date().getFullYear();

    return currentYear - yearOfBirth >= 18;
  }
}