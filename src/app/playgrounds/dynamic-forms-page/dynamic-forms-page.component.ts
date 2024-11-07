import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DynamicFormConfig } from './models/dynamic-form.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: [
    '../common-form.scss',
    './dynamic-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsPageComponent implements OnInit {

  form!: FormGroup;

  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected formConfig$!: Observable<DynamicFormConfig>;

  constructor(private http: HttpClient) { }

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
      .forEach(key => {
        this.form.addControl(key, new FormControl(controls[key].value));
      });

    console.log(this.form.value);
  }
}