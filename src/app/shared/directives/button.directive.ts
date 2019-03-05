import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Directive({
  selector: '[tlimsButton]'
})
export class ButtonDirective implements  OnChanges, OnInit {

  @Input()
  tlimsButton: boolean;
  @Input()
  btnText: string;
  @Input()
  color: string;
  originalText: string;
  icon = '<i class="fa fa-spinner fa-spin"></i>';

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'btn');
    this.renderer.addClass(this.el.nativeElement, 'btn-success');
    // this.renderer.addClass(this.el.nativeElement, 'waves-effect');
    // this.renderer.addClass(this.el.nativeElement, 'waves-light');
    // this.renderer.addClass(this.el.nativeElement, 'mr-1');
    if (!isNullOrUndefined(this.color)) {
      this.renderer.addClass(this.el.nativeElement, this.color);
    }
    this.originalText = this.el.nativeElement.innerHTML;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tlimsButton.currentValue) {
      this.loading(this.btnText, true);
    } else {
      this.loading(this.originalText || this.el.nativeElement.innerHTML, false);
    }
  }

  private loading(text: string, isLoading: boolean) {
    // console.log(isLoading);
    this.el.nativeElement.innerHTML = text || '';
    if (isLoading) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      this.el.nativeElement.innerHTML = !isNullOrUndefined(text) ?  text + ' ' + this.icon : this.icon;
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    }
  }

}
