import {Ad} from '../ad';
import {CodeValue} from 'core/model/base-model';

export class Electronic extends  Ad {
  electMake: CodeValue = new CodeValue();
  model: string;
  processor: CodeValue = new CodeValue();
  coreNo: CodeValue = new CodeValue();
  ram: CodeValue = new CodeValue();
  capacity: CodeValue = new CodeValue();
}
