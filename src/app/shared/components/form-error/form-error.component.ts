import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, AbstractControlDirective} from '@angular/forms';

@Component({
  selector: 'tlims-form-error',
  template: `
    <span class="form-text text-danger error-message" *ngIf="shouldShowErrors()"> {{getError()}}</span>
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

  formNames = {};

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
    // console.log(this.control.errors);
    const errors = Object.keys(this.control.errors).map(field => this.getMessage(field, this.control.errors[field], this.control));
    return errors[0];
  }

  private getMessage(type: string, params: any, control: any) {
    let fname = this.getControlName(control);
    for (const init in this.formNames) {
      if (fname === init) {
        fname = this.formNames[fname];
      } else {
        fname = fname;
      }
    }
    const msg = FormErrorComponent.errorMessages[type](params);
    let fieldName = fname.replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase());
    fieldName = this.label ? this.label : fieldName;
    return msg.replace('##FIELD##', fieldName);
  }

  getControlName(c: AbstractControl): string | null {
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
  }


}
