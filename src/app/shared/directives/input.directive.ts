import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[tlimsInput]'
})
export class InputDirective {

  constructor (private el: ElementRef, private renderer: Renderer2) {
    // renderer.addClass(el.nativeElement, 'form-control-sm');
    renderer.addClass(el.nativeElement, 'form-control');
  }

}
