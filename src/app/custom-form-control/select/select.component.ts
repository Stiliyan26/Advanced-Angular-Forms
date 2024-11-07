import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { OptionComponent } from '../option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


export type SelectValue<T> = T | T[] | null;

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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T> implements OnChanges, AfterContentInit, OnDestroy, ControlValueAccessor {

  @Input()
  label = '';

  @Input()
  searchable = false;

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  @Input()
  displayWith: ((value: T) => string | number) | null = null;

  @Input()
  compareWith: ((v1: T | null, v2: T | null) => boolean) = (v1, v2) => v1 === v2;

  @Input()
  set value(value: SelectValue<T>) {
    this.setupValue(value);
    this.onChange(this.value);
    this.highlightSelectedOptions();
  };

  get value() {
    if (this.selectionModel.isEmpty()) {
      return null;
    }

    if (this.selectionModel.isMultipleSelection()) {
      return this.selectionModel.selected;
    }

    return this.selectionModel.selected[0];
  }

  private selectionModel: SelectionModel<T>;

  protected onChange: (newValue: SelectValue<T>) => void = () => {};

  constructor(@Attribute('multiple') private multiple: string) {
    this.selectionModel = new SelectionModel<T>(coerceBooleanProperty(this.multiple));
  }

  writeValue(value: SelectValue<T>): void {
    this.setupValue(value);
    this.highlightSelectedOptions();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly selectionChanged = new EventEmitter<SelectValue<T>>();

  @Output()
  readonly closed = new EventEmitter<void>();

  @Output()
  readonly searchChanged = new EventEmitter<string>();

  @HostListener('click')
  open() {
    if (this.disabled) return;

    this.isOpen = true;

    if (this.searchable) {
      requestAnimationFrame(() => {
        if (this.searchInputEl?.nativeElement) {
          this.searchInputEl.nativeElement.focus();
        }
      });
    }
  }

  close() {
    this.isOpen = false;
  }
  //Descendants instrcts to select the indirect options if the optionComponents is nestead in an element
  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  @ViewChild('input')
  searchInputEl!: ElementRef<HTMLInputElement>;

  @HostBinding('class.select-panel-open')
  isOpen = false;

  protected get displayValue() {
    if (this.displayWith && this.value) {

      return Array.isArray(this.value)
        ? this.value.map(this.displayWith)
        : this.displayWith(this.value);
    }

    return this.value;
  }

  private unsubscribe$ = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith = changes['compareWith'].currentValue;
      this.highlightSelectedOptions();
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
      tap(() => queueMicrotask(() => this.highlightSelectedOptions())),
      //Listen to all event emitters
      switchMap(options => merge(...options.map(o => o.selected))), //cancels previous subscribtion helps with memory leak
      takeUntil(this.unsubscribe$)
    ).subscribe(selectedOption => this.handleSelection(selectedOption));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  clearSelection(e: Event) {
    e.stopPropagation();

    if (this.disabled) return;

    this.selectionModel.clear();

    this.selectionChanged.emit(this.value);
    this.onChange(this.value);
  }

  protected onPanelAnimationDone(event: AnimationEvent): void {
    if (event.fromState === 'void' && event.toState === null && this.isOpen) {
      this.opened.emit();
    }
    if (event.fromState === null && event.toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  protected onHandleInput(e: Event) {
    this.searchChanged.emit((e.target as HTMLInputElement).value);
  }

  private handleSelection(option: OptionComponent<T>) {
    if (this.disabled) return;

    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
      this.onChange(this.value);
    }

    if (!this.selectionModel.isMultipleSelection()) {
      this.close();
    }
  }

  private highlightSelectedOptions(): void {
    const valuesWithUpdatedReferences = this.selectionModel.selected.map(value => {
      const correspondingOption = this.findOptionByValue(value);

      return correspondingOption
        ? correspondingOption.value!
        : value;
    });

    this.selectionModel.clear();
    this.selectionModel.select(...valuesWithUpdatedReferences);

    // this.findOptionByValue(value)?.highlightAsSelected();
  }

  private findOptionByValue(value: T | null): OptionComponent<T> | undefined {
    return this.options && this.options.find(o => this.compareWith(o.value, value));
  }

  private setupValue(value: SelectValue<T>) {
    this.selectionModel.clear();

    if (value) {
      Array.isArray(value)
        ? this.selectionModel.select(...value)
        : this.selectionModel.select(value);
    }
  }
}
