import {Ad} from '../ad';
import {CodeValue} from 'core/model/base-model';

export class Repair extends Ad {
  shape: CodeValue = new CodeValue();
  frameMaterial: CodeValue = new CodeValue();
}
