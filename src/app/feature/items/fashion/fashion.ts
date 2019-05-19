import {Ad} from '../ad';
import {CodeValue} from 'core/model/base-model';

export class Fashion extends Ad {
  gender: any;
  material: string;
  material2: string;
  fastening: string;
  color: string;
  movement: CodeValue = new CodeValue();
  closure: string;
  display: CodeValue = new CodeValue();
  fashionSize: string;
  fashionStyle: string;
  jewelStone: CodeValue = new CodeValue();
  features: string;
  typeList: string;
}
