import { Highlightable } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent<T> implements OnInit, Highlightable {

  @Input()
  value: T | null = null;

  @Input()
  disabledReason = ''

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  @Output()
  selected = new EventEmitter<OptionComponent<T>>();

  @HostListener('click')
  protected select() { 
    if (!this.disabled) {
      this.highlightAsSelected();
      this.selected.emit(this);
    }

  }

  @HostBinding('class.selected')
  protected isSelected: boolean = false;

  @HostBinding('class.active')
  protected isActive: boolean = false;

  constructor(private cd: ChangeDetectorRef) { }

  setActiveStyles(): void {
    this.isActive = true;
    this.cd.markForCheck();
  }

  setInactiveStyles(): void {
    this.isActive = false;
    this.cd.markForCheck();
  }

  getLabel?(): string {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void { }

  highlightAsSelected() {
    this.isSelected = true;
    this.cd.markForCheck();
  }

  deselect() {
    this.isSelected = false;
    this.cd.markForCheck();
   }
}
