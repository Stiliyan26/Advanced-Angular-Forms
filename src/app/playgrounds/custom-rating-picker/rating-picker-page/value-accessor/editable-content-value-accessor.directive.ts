import { Directive, ElementRef, HostListener, inject, Renderer2, SecurityContext } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

const DEFAULT_REVIEW_TEMPLATE = `
  <h4 data-placeholder="Title..."></h4>
  <p data-placeholder="Describe Your Experiance..."></p>
`;

@Directive({
  selector: '[formControlName][contenteditable],[formControl][contenteditable],[ngModel][contenteditable]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EditableContentValueAccessor,
      multi: true
    }
  ]
})
export class EditableContentValueAccessor implements ControlValueAccessor {

  onChange!: (newValue: string) => void;
  onTouch!: () => void;

  @HostListener('input', ['$event'])
  onInput(e: Event) {
    this.onChange((e.target as HTMLElement).innerHTML);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouch();
  }

  private renderer: Renderer2 = inject(Renderer2);
  private elementRef: ElementRef = inject(ElementRef);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  writeValue(obj: any): void {
    console.log('Method writeValue has been called.', obj);

    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      this.sanitizer.sanitize(SecurityContext.HTML, obj) || DEFAULT_REVIEW_TEMPLATE
    );
  }

  registerOnChange(fn: any): void {
    console.log('Method registerOnChange has been called.', fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('Method registerOnTouched has been called.', fn);
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    console.log('Method setDisabledState has been called.', isDisabled);

    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'contentEditable',
      !isDisabled
    );
  }

}
