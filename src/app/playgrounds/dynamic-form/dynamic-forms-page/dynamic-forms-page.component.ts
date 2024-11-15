import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DynamicControlResolver } from '../service/dynamic-control-resolver.service';
import { ControlInjectorPipe } from '../pipe/control-injector.pipe';
import { comparatorFn } from '../dynamic-controls/base-dynamic-control';
import { DynamicFormConfig } from '../models/dynamic-form.model';

import { VALIDATION_ERROR_MESSAGES, ERROR_MESSAGES } from '../../../core/validation-error-message.token';
import { DynamicValidatorMessageDirective } from '../../../core/dynamic-validator-message.directive';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ControlInjectorPipe, 
    DynamicValidatorMessageDirective
  ],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: [
    '../../common-form.scss',
    './dynamic-forms-page.component.scss',
  ],
  providers: [
    {
      provide: VALIDATION_ERROR_MESSAGES,
      useValue: { ...ERROR_MESSAGES, required: () => `Don't leave this field empty` }
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsPageComponent implements OnInit {

  protected comparatorFn = comparatorFn;

  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected formConfig$!: Observable<{ form: FormGroup, config: DynamicFormConfig }>;

  private http = inject(HttpClient);
  protected controlResolver = inject(DynamicControlResolver);

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger.pipe(
      switchMap(config => this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)),
      map(config => ({
        config,
        form: new FormGroup({})
      }))
    );
  }

  protected onSubmit(form: FormGroup) {
    console.log('Submitted data: ', form.value);

    form.reset();
  }
}