import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { OptionComponent } from '../option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';


export type SelectValue<T> = T | null;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  animations: [
    trigger('dropDown', [
      state('void', style({ transform: 'scaleY(0)', opacity: 0 })),
      state('*', style({ transform: 'scaleY(1)', opacity: 1 })),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      transition(':leave', [animate('420ms cubic-bezier(0.88,-0.7, 0.86, 0.85)')]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T> implements OnChanges, AfterContentInit, OnDestroy {

  @Input()
  label = '';

  @Input()
  displayWith: ((value: T) => string | number ) | null = null;

  @Input()
  compareWith: ((v1: T | null, v2: T | null) => boolean) = (v1, v2) => v1 === v2;

  @Input()
  set value(value: SelectValue<T>) {
    this.selectionModel.clear();

    if (value) {
      this.selectionModel.select(value);
    }
  };

  get value() {
    return this.selectionModel.selected[0] || null;
  }

  private selectionModel = new SelectionModel<T>();

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly selectionChanged = new EventEmitter<SelectValue<T>>();

  @Output()
  readonly closed = new EventEmitter<void>();

  @HostListener('click')
  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
  //Descendants instrcts to select the indirect options if the optionComponents is nestead in an element
  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  isOpen = false;

  protected get displayValue() {
    if (this.displayWith && this.value) {
      return this.displayWith(this.value);
    }

    return this.value;
  }

  private unsubscribe$ = new Subject<void>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith =  changes['compareWith'].currentValue;
      this.highlightSelectedOptions(this.value);
    }
  }

  ngAfterContentInit(): void {
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(values => {
        values.removed.forEach(rv => this.findOptionByValue(rv)?.deselect());
        console.log(values);

        values.added.forEach(av => this.findOptionByValue(av)?.highlightAsSelected());
      });

    this.options.changes.pipe(
      startWith<QueryList<OptionComponent<T>>>(this.options),
      tap(() => queueMicrotask(() => this.highlightSelectedOptions(this.value))),
      //Listen to all event emitters
      switchMap(options => merge(...options.map(o => o.selected))), //cancels previous subscribtion helps with memory leak
      takeUntil(this.unsubscribe$)
    ).subscribe(selectedOption => this.handleSelection(selectedOption));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPanelAnimationDone(event: AnimationEvent): void {
    if (event.fromState === 'void' && event.toState === null && this.isOpen) {
      this.opened.emit();
    }
    if (event.fromState === null && event.toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  private handleSelection(option: OptionComponent<T>) {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
    }

    this.close();
  }

  private highlightSelectedOptions(value: SelectValue<T>): void {
    this.findOptionByValue(value)?.highlightAsSelected();
  }

  private findOptionByValue(value: T | null): OptionComponent<T> | undefined {
    return this.options && this.options.find(o => this.compareWith(o.value, value));
  }
}
