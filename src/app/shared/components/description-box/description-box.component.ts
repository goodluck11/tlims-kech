import {Component, EventEmitter, forwardRef, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Utils} from 'core/utils/utils';

@Component({
  selector: 'tlims-description-box',
  templateUrl: './description-box.component.html',
  styleUrls: ['./description-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DescriptionBoxComponent),
      multi: true
    }
  ]
})
export class DescriptionBoxComponent implements OnInit, ControlValueAccessor {

  htmlContent: string;
  myCkeditorConfig: any;
  @Output()
  change = new EventEmitter();
  onChange: Function = (content: any) => {};

  onTouched: Function = () => {};

  constructor() {
  }

  ngOnInit() {
    this.myCkeditorConfig = {
      editable: true,
      spellcheck: false,
      height: '10rem',
      minHeight: '5rem',
      enableToolbar: true,
      showToolbar: true,
    };
  }

  getContent() {
    if (Utils.isEmpty(this.htmlContent)) {
      this.onTouched();
    } else {
      this.onChange(this.htmlContent);
      this.change.emit(this.htmlContent);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.htmlContent = obj;
  }

}
