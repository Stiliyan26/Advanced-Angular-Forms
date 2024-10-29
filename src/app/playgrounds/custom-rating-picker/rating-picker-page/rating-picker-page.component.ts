import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@polymer/paper-input/paper-textarea';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditableContentValueAccessor } from './value-accessor/editable-content-value-accessor.directive';
import { RatingPickerComponent } from '../../../custom-form-control/rating-picker/rating-picker.component';
import { RatingOptions } from '../../../custom-form-control/model/rating-options.type';

interface Rating {
  reviewText: string,
  reviewRating: RatingOptions
}

@Component({
  selector: 'app-rating-picker-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditableContentValueAccessor,
    RatingPickerComponent
  ],
  templateUrl: './rating-picker-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    './rating-picker-page.component.scss',
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingPickerPageComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder);

  form = this.fb.group<Rating>({
    reviewText: '',
    reviewRating: 'great'
  });

  ngOnInit(): void {
    // this.form.controls.reviewText.disable();
    // this.form.controls.reviewRating.disable();
  }


  onSubmit() {
    console.log(this.form.value);
    this.form.reset();
  }
}
