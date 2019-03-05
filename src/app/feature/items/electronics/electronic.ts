import {Ad} from '../ad';
import {CodeValue} from '../../../core/model/base-model';

export class Electronic extends  Ad {
  electMake: CodeValue = new CodeValue();
  electModel: CodeValue = new CodeValue();
  electSubType: CodeValue = new CodeValue();
  processor: CodeValue = new CodeValue();
  coreNo: CodeValue = new CodeValue();
  ram: CodeValue = new CodeValue();
}
