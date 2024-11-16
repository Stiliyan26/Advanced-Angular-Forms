import { ComponentRef, Directive, ElementRef, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, NgControl, NgForm, NgModel } from '@angular/forms';
import { distinctUntilChanged, EMPTY, fromEvent, iif, merge, skip, startWith, Subscription, tap } from 'rxjs';
import { InputErrorComponent } from './input-error.component';

@Directive({
  selector: '[ngModel],[formControl],[formControlName]',
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit, OnDestroy {
  //gets the control from the same element the directive is on, not from a parent
  ngControl = inject(NgControl, { self: true }); // token comes from the same nde { self: true }
  elementRef = inject(ElementRef);

  get form() {
    return this.parentContainer?.formDirective as NgForm | FormGroupDirective | null;
  }

  private vcr = inject(ViewContainerRef);

  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private errrorMessageTrigger!: Subscription;
  private parentContainer = inject(ControlContainer, { optional: true });


  ngOnInit(): void {
    if (!this.ngControl.control) throw Error(`No control model for ${this.ngControl.name} control...`);

    const statusChanges$ = this.ngControl.control.statusChanges
      .pipe(
        distinctUntilChanged()
      );

    const blur$ = fromEvent(this.elementRef.nativeElement, 'blur')
      .pipe(
        tap(() => {
          this.ngControl.control?.markAsTouched();
          this.ngControl.control?.updateValueAndValidity();
        })
      );

    this.errrorMessageTrigger = merge(
      statusChanges$, 
      blur$,
      iif(() => !!this.form, this.form!.ngSubmit, EMPTY)
    )
      .pipe(
        startWith(this.ngControl.control.status), //  Emits the initial status immediately
        skip(this.ngControl instanceof NgModel ? 1 : 0), //If using template-driven forms (NgModel), skips the first emission
      ).subscribe(() => {
        if (this.ngControl.errors && this.form?.submitted) {

          if (!this.componentRef) {
            this.componentRef = this.vcr.createComponent(InputErrorComponent);
            this.componentRef.changeDetectorRef.markForCheck();
          }
          // this.componentRef ??= this.vcr.createComponent(InputErrorComponent);
          this.componentRef.setInput('errors', this.ngControl.errors);
        } else {
          this.componentRef?.destroy();
          this.componentRef = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.errrorMessageTrigger.unsubscribe();
  }
}
