import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'codeValueTokenizer'
})
export class CodeValueTokenizerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const names = [];
      const arr = JSON.parse(value);
      arr.map(a => names.push(a.name));
      return names.join(', ');
    }
    return value;
  }

}
