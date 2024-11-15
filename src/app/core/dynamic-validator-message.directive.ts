import { ComponentRef, Directive, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import { filter, skip, startWith, Subscription } from 'rxjs';
import { InputErrorComponent } from './input-error.component';

@Directive({
  selector: '[ngModel],[formControl],[formControlName]',
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit, OnDestroy {
  //gets the control from the same element the directive is on, not from a parent
  ngControl = inject(NgControl, { self: true }); // token comes from the same nde { self: true }

  private vcr = inject(ViewContainerRef);

  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private errrorMessageTrigger!: Subscription;

  ngOnInit(): void {
    if (!this.ngControl.control) throw Error(`No control model for ${this.ngControl.name} control...`);

    this.errrorMessageTrigger = this.ngControl.control.statusChanges
      .pipe(
        startWith(this.ngControl.control.status), //  Emits the initial status immediately
        skip(this.ngControl instanceof NgModel ? 1 : 0), //If using template-driven forms (NgModel), skips the first emission
        filter(status => status === 'VALID' || status === 'INVALID')
      ).subscribe(() => {
        if (this.ngControl.errors) {

          if (!this.componentRef) {
            this.componentRef = this.vcr.createComponent(InputErrorComponent);
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
