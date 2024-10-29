import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss'
})
export class OptionComponent implements OnInit {

  @Input()
  value: string | null = null;

  @Output()
  selected = new EventEmitter<OptionComponent>();

  @HostListener('click')
  select() { 
    this.isSelected = true;
    this.selected.emit(this);
  }

  @HostBinding('class.selected')
  protected isSelected: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  deselect() {
    this.isSelected = false;
   }
}
