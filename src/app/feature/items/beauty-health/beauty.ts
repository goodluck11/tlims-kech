import {Ad} from '../ad';
import {CodeValue} from 'core/model/base-model';

export class Beauty extends Ad {
  gender: any;
  color: string;
  scent: CodeValue = new CodeValue();
  formulation: CodeValue = new CodeValue();
  volume: string;
  tone: CodeValue = new CodeValue();
  skinType: CodeValue = new CodeValue();
  targetArea: CodeValue = new CodeValue();
  benefits: CodeValue = new CodeValue();
  ageGroup: CodeValue = new CodeValue();
  vPackage: CodeValue = new CodeValue();
}
