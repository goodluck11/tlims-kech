import {Ad} from '../ad';
import {CodeValue} from 'core/model/base-model';

export class Mobile extends Ad {
  model: CodeValue = new CodeValue();
  storageCapacity: CodeValue = new CodeValue();
  color: string;
  screenSize: CodeValue = new CodeValue();
  ram: CodeValue = new CodeValue();
  os: CodeValue = new CodeValue();
  isExchangeable: boolean;
}

export enum MobileCondition {
  USED = 'Used',
  NEW = 'New',
  REFURBISHED = 'Refurbished'
}
