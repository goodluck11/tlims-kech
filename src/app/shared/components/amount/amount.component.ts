import {Component, EventEmitter, forwardRef, HostBinding, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'tlims-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmountComponent),
      multi: true
    }
  ]
})
export class AmountComponent implements OnInit, ControlValueAccessor {

  amount: string;
  disabled = false;
  @Output()
  change = new EventEmitter();

  onChange: Function = (amount: any) => {}

  onTouched: Function = () => {}

  @HostBinding('style.opacity')
  get opacity() {
    return this.disabled ? 0.25 : 1;
  }

  constructor(private decimalPipe: DecimalPipe) { }

  ngOnInit() {
  }

  onTouchedInput() {
    if (isNullOrUndefined(this.amount)) {
      this.onTouched();
    }
  }

  onInputChange() {
    this.onChange(this.amount ? this.amount.replace(/,/g, '') : '0');
  }

  writeValue(amount: any): void {
    this.amount = this.amount ? this.amount.replace(/,/g, '') : '0';
    this.amount = this.decimalPipe.transform(amount, '1.2-5');
    // this.onChange(this.amount);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}

