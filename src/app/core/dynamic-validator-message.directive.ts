import { Directive, inject, OnInit } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import { filter, skip, startWith } from 'rxjs';

@Directive({
  selector: '[ngModel],[formControl],[formControlName]',
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit {
  ngControl = inject(NgControl, { self: true }); // token comes from the same nde { self: true }

  ngOnInit(): void {
    this.ngControl.control?.statusChanges
      .pipe(
        startWith(this.ngControl.control.status),
        skip(this.ngControl instanceof NgModel ? 1 : 0), // Skips immidiatly init status for template forms
        filter(status => status === 'VALID' || status === 'INVALID')
      )
      .subscribe(console.log)
  }
}
