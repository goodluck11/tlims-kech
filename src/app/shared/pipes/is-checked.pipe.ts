import {Pipe, PipeTransform} from '@angular/core';
import {CodeValue} from 'core/model/base-model';

@Pipe({
  name: 'isChecked'
})
export class IsCheckedPipe implements PipeTransform {

  transform(values: Array<CodeValue>, args: CodeValue): any {
    if (values.length === 0) {
      return false;
    }
    return !!values.filter(value => value.code === args.code)[0];
  }

}
