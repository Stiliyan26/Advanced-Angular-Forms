import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { DynamicControl } from '../models/dynamic-form.model';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[activateControlIf]',
  standalone: true
})
export class ActivateControlIfDirective implements OnInit, OnDestroy {
  @Input('activateControlIf')
  config?: DynamicControl['activationConfig'];

  private vcr = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private formGroupDir = inject(FormGroupDirective);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    if (!this.config) {
      this.vcr.createEmbeddedView(this.templateRef);
      return;
    }

    const { controlPath, hasValue } = this.config;

    // Wait for next tick to ensure form is initialized
    timer(0)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const form = this.formGroupDir.form;
        
        // Support for nested paths
        const value = controlPath.includes('.') 
          ? form.get(controlPath)?.value
          : form.value[controlPath];

        console.log('Initial form value:', {
          path: controlPath,
          value,
          expected: hasValue
        });
        
        // Initial check
        this.updateView(value);

        // Subscribe to value changes
        if (controlPath.includes('.')) {
          // For nested paths, subscribe to specific control
          const control = form.get(controlPath);
          if (control) {
            control.valueChanges
              .pipe(takeUntil(this.destroy$))
              .subscribe(newValue => {
                console.log('Nested value changed:', newValue);
                this.updateView(newValue);
              });
          }
        } else {
          // For root level paths, subscribe to form changes
          form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(formValue => {
              const newValue = formValue[controlPath];
              console.log('Value changed:', newValue);
              this.updateView(newValue);
            });
        }
      });
  }

  private updateView(value: any) {
    if (!this.config) return;
    
    console.log('Updating view:', { 
      value, 
      expected: this.config.hasValue 
    });

    if (value === this.config.hasValue) {
      if (!this.vcr.length) {
        this.vcr.createEmbeddedView(this.templateRef);
      }
    } else {
      this.vcr.clear();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}