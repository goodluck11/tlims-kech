import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[tlimsTable]'
})
export class TableDirective {

  constructor (private el: ElementRef, private renderer: Renderer2) {
    renderer.addClass(el.nativeElement, 'table');
    renderer.addClass(el.nativeElement, 'table-sm');
    renderer.addClass(el.nativeElement, 'table-hover');
    renderer.addClass(el.nativeElement, 'table-striped');
  }
}
