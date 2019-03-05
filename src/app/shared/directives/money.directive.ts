import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {DecimalPipe} from '@angular/common';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[tlimsMoney]'
})
export class MoneyDirective implements AfterViewInit {

  // Allow decimal numbers. The \. is only allowed once to occur
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
  // Allow key codes for special events.
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  @Input() mbcpMoney: any;

  constructor(private el: ElementRef, private decimalPipe: DecimalPipe,
              private render: Renderer2, private control: NgControl) {
  }

  ngAfterViewInit() {
    this.render.setStyle(this.el.nativeElement, 'textAlign', 'right');
  }

  @HostListener('focus', ['$event.target'])
  onFocus(target) {
    if (!isNullOrUndefined(target.value)) {
      this.el.nativeElement.value = this.el.nativeElement.value.toString().replace(/,/g, '');
      // console.log(this.el.nativeElement.value);
    }
  }

  @HostListener('blur', ['$event.target'])
  onBlur(target) {
    if (target.value <= 0) {
      return '';
    }
    target.value = target.value ? target.value.toString().replace(/,/g, '') : '0';
    this.control.control.setValue(this.decimalPipe.transform(target.value, '1.2-5'));
  }

  @HostListener('keydown', ['$event'])
  onInput(event: KeyboardEvent) {
    // console.log(event);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1 ||
      // to allow backspace, enter, escape, arrows
      (event.which == 65 && event.ctrlKey == true) ||
      // Allow: Ctrl+C
      (event.which == 67 && event.ctrlKey == true) ||
      // Allow: Ctrl+X
      (event.which == 88 && event.ctrlKey == true)) {
      return;
    }
    // Do not use event.keycode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}
