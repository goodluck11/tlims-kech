import { Pipe, PipeTransform } from '@angular/core';
import {isArray} from 'core/utils/utils';

@Pipe({
  name: 'codeValueTokenizer'
})
export class CodeValueTokenizerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const arr: any = JSON.parse(value);
      if (isArray(arr)) {
        return arr.map(a => a.name).join(', ');
      } else {
        return arr.name;
      }
    }
    return value;
  }

}
