import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, AbstractControlDirective} from '@angular/forms';

@Component({
  selector: 'tlims-form-error',
  template: `
    <span class="form-text text-danger error-message animated shake" *ngIf="shouldShowErrors()"> {{getError()}}</span>
  `,
  styleUrls: ['./form-error.component.scss']
})
export class FormErrorComponent {

  private static readonly errorMessages = {
    'required': (params) => '##FIELD## is required *',
    'minlength': (params) => '##FIELD## should be minimum ' + params.requiredLength + ' characters',
    'maxlength': (params) => '##FIELD## should not be greater than ' + params.requiredLength + ' characters',
    'pattern': (params) => 'Should be a valid',
    'email': (params) => 'Invalid email *',
    'vaildEmail': (params) => 'Invalid email',
    'specialCharacter': (params) => 'No Special Characters are Allowed *',
    'startsWith': (params) => '##FIELD## must start with ' + params.value,
    'numberOnly': (params) => 'Only Numbers are allowed *',
    'letterOnly': (params) => 'Only Letters are allowed *',
    'min': (params) => '##FIELD## minimum character is ' + params.minValue,
    'max': (params) => '##FIELD## maximum character is ' + params.maxValue,
    'minDate': (params) => 'Date must be after the selected date',
    'maxDate': (params) => 'Date must be before the selected date ',
    'customMessage': (params) => params.value
  };

  formNames = [];

  @Input()
  private control: AbstractControlDirective | AbstractControl;
  @Input()
  private label: string;

  shouldShowErrors(): boolean {
    return this.control && this.control.errors && (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors).map(field => this.getMessage(field, this.control.errors[field], this.control));
  }

  getError(): string {
    const errors = Object.keys(this.control.errors).map(field => this.getMessage(field, this.control.errors[field], this.control));
    return errors[0];
  }

  private getMessage(type: string, params: any, control: any) {
    let fname = this.getControlName(control);
    for (const init in this.formNames) {
      if (fname === init) {
        fname = this.formNames[fname];
      }
    }
    const msg = FormErrorComponent.errorMessages[type](params);
    const fieldName = this.label ? this.label : FormErrorComponent.stripFormName(fname);
    return msg.replace('##FIELD##', fieldName);
  }

  private static stripFormName(name: string) {
    return name.replace(/([A-Z])/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase());
  }

  getControlName(c: AbstractControl): string | null {
    if (c.parent) {
      const formGroup = c.parent.controls;
      return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
    }
    return null;
  }


}
