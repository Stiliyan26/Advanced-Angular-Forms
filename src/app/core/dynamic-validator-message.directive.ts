import { ComponentRef, Directive, ElementRef, inject, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, NgControl, NgForm, NgModel } from '@angular/forms';
import { EMPTY, fromEvent, iif, merge, skip, startWith, Subscription } from 'rxjs';

import { InputErrorComponent } from './input-error.component';
import { ErrorStateMatcher } from './error-state-matcher.service';

@Directive({
  selector: `
    [ngModel]:not([withoutValidationErrors]),
    [formControl]:not([withoutValidationErrors]),
    [formControlName]:not([withoutValidationErrors]),
    [formGroupName]:not([withoutValidationErrors]),
    [ngModelGroup]:not([withoutValidationErrors])
  `,
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit, OnDestroy {
  //gets the control from the same element the directive is on, not from a parent
  // token comes from the same nde { self: true }
  ngControl = inject(NgControl, { self: true, optional: true }) 
    || inject(ControlContainer, { self: true });

  elementRef = inject(ElementRef);

  get form() {
    return this.parentContainer?.formDirective as NgForm | FormGroupDirective | null;
  }

  @Input()
  errorStateMatcher = inject(ErrorStateMatcher);

  @Input()
  container = inject(ViewContainerRef);

  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private errrorMessageTrigger!: Subscription;
  private parentContainer = inject(ControlContainer, { optional: true });


  ngOnInit(): void {
    //TODO: stream that listnes for status changes for registered control

    //use queueMicroTask becouse creating a formGroup using ngModelGroup is happening async 
    queueMicrotask(() => {
      if (!this.ngControl.control) throw Error(`No control model for ${this.ngControl.name} control...`);

      this.errrorMessageTrigger = merge(
        this.ngControl.control.statusChanges,
        fromEvent(this.elementRef.nativeElement, 'blur'),
        iif(() => !!this.form, this.form!.ngSubmit, EMPTY)
      ).pipe(
        startWith(this.ngControl.control.status), //  Emits the initial status immediately
        skip(this.ngControl instanceof NgModel ? 1 : 0), //If using template-driven forms (NgModel), skips the first emission
      ).subscribe(() => {
        if (this.errorStateMatcher.isErrorVisible(this.ngControl.control, this.form)) {

          if (!this.componentRef) {
            this.componentRef = this.container.createComponent(InputErrorComponent);
            this.componentRef.changeDetectorRef.markForCheck();
          }
          // this.componentRef ??= this.container.createComponent(InputErrorComponent);
          this.componentRef.setInput('errors', this.ngControl.errors);
        } else {
          this.componentRef?.destroy();
          this.componentRef = null;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.errrorMessageTrigger.unsubscribe();
  }
}
