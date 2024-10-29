import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';


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
export class SelectComponent implements OnInit {

  @Input()
  label = '';

  @Input()
  value: string | null = null;

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly closed = new EventEmitter<void>();

  @HostListener('click')
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }
  
  isOpen = false;

  constructor() { }

  ngOnInit(): void {

  }

  onPanelAnimationDone(event: AnimationEvent) {
    if (event.fromState === 'void' && event.toState === null && this.isOpen) {
      this.opened.emit();
    }
    if (event.fromState === null && event.toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }
}
