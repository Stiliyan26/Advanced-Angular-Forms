import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { FormGroupDirective } from '@angular/forms';
import { DynamicControl } from '../models/dynamic-form.model';
import { distinctUntilChanged, filter, map, pairwise, startWith, Subject, switchMap, takeUntil } from 'rxjs';

@Directive({
  selector: '[activateControlIf]',
  standalone: true
})
export class ActivateControlIfDirective implements OnInit, OnDestroy {

  @Input('activateControlIf')
  config?: DynamicControl['activationConfig']

  private vcr = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private rootFormGroup = inject(FormGroupDirective).form;

  // detecting a moment when control we need is registered in the form.
  private isControlRegistered$ = this.rootFormGroup.valueChanges
    .pipe(
      startWith(this.rootFormGroup.value),
      map(() => !!this.rootFormGroup.get(this.config?.controlPath!)),
      distinctUntilChanged()
    )
  // get an instance of the control
  private registeredControl$ = this.isControlRegistered$
    .pipe(
      filter(Boolean),
      map(() => this.rootFormGroup.get(this.config?.controlPath!))
    );

  private controlRemove$ = this.isControlRegistered$
    .pipe(
      pairwise(),
      filter(([prevValue, currentValue]) => prevValue === true && currentValue === false)
    );

  private destory$ = new Subject<void>();

  ngOnInit() {
    if (!this.config) {
      this.vcr.createEmbeddedView(this.templateRef);
      return;
    }
    // start listening to the control changes
    this.registeredControl$.pipe(
      switchMap(control => control!.valueChanges
        .pipe(
          startWith(control?.value)
        )
      ),
      takeUntil(this.destory$)
    ).subscribe(value => {
      this.vcr.clear();
      // adjust (show/hide) view accordingly with control changes.
      if (this.config?.hasValue === value) {
        this.vcr.createEmbeddedView(this.templateRef);
      }
    });

    // destroy the embedded view if the tracking control is removed from the form.
    this.controlRemove$
      .pipe(takeUntil(this.destory$))
      .subscribe(() => this.vcr.clear());
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}