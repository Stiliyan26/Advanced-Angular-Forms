import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { OptionComponent } from '../option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, Subject, switchMap, takeUntil } from 'rxjs';


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
  ]
})
export class SelectComponent implements AfterContentInit, OnDestroy {

  @Input()
  label = '';

  @Input()
  set value(value: string | null) {
    this.selectionModel.clear();

    if (value) {
      this.selectionModel.select(value);
    }
  };

  get value() {
    return this.selectionModel.selected[0] || null;
  }

  private selectionModel = new SelectionModel<string>();

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly selectionChanged = new EventEmitter<string | null>();

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
  options!: QueryList<OptionComponent>;

  isOpen = false;

  private unsubscribe$ = new Subject<void>();

  constructor() { }

  ngAfterContentInit(): void {
    this.highlightSelectedOptions(this.value);

    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(values => {
        values.removed.forEach(rv => this.findOptionByValue(rv)?.deselect())
      });

    this.options.changes.pipe(
      startWith<QueryList<OptionComponent>>(this.options),
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

  private handleSelection(option: OptionComponent) {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
    }

    this.close();
  }

  private highlightSelectedOptions(value: string | null): void {
    this.findOptionByValue(value)?.highlightAsSelected();
  }

  private findOptionByValue(value: string | null): OptionComponent | undefined {
    return this.options && this.options.find(o => o.value === value);
  }
}
