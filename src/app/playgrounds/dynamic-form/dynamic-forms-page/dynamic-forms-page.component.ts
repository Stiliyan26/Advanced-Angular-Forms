import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DynamicControl, DynamicFormConfig } from '../models/dynamic-form.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { banWords } from '../../reactive-forms/reactive-forms-page/validators/ban-words.validator';
import { DynamicControlResolver } from '../service/dynamic-control-resolver.service';
import { ControlInjectorPipe } from '../pipe/control-injector.pipe';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: [
    '../../common-form.scss',
    './dynamic-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsPageComponent implements OnInit {

  form!: FormGroup;

  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected formConfig$!: Observable<DynamicFormConfig>;

  private http = inject(HttpClient);
  protected controlResolver = inject(DynamicControlResolver);

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger.pipe(
      switchMap(config => this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)),
      tap(({ controls }) => this.buildForm(controls))
    );
  }

  protected onSubmit() {
    console.log('Submitted data: ', this.form.value);

    this.form.reset();
  }

  private buildForm(controls: DynamicFormConfig['controls']) {
    this.form = new FormGroup({});

    Object.keys(controls)
      .forEach(key => this.buildControls(
        key,
        controls[key],
        this.form
      ));

    console.log(this.form.value);
  }

  private buildGroup(controlKey: string, controls: DynamicControl['controls'], parentFromGroup: FormGroup) {
    if (!controls) return;

    const nestedFormGroup = new FormGroup({});

    Object.keys(controls)
      .forEach(key => this.buildControls(key, controls[key], nestedFormGroup));

    parentFromGroup.addControl(controlKey, nestedFormGroup);
  }


  
  private buildControls(controlKey: string, config: DynamicControl, fromGroup: FormGroup) {
    if (config.controlType === 'group') {
      this.buildGroup(controlKey, config.controls, fromGroup);
      return
    }

    const validators = this.resolveValidators(config)
    fromGroup.addControl(controlKey, new FormControl(config.value, validators));
  }

  private resolveValidators({ validators = {} }: DynamicControl) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map(validatorKey => {
      const validatorValue = validators[validatorKey];

      if (validatorKey === 'required') {
        return Validators.required;
      }

      if (validatorKey === 'email') {
        return Validators.email;
      }

      if (validatorKey === 'requiredTrue') {
        return Validators.requiredTrue;
      }

      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }

      if (validatorKey === 'banWords' && Array.isArray(validatorValue)) {
        return banWords(validatorValue);
      }

      return Validators.nullValidator;
    });
  }
}