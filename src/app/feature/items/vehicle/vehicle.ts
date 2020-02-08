import {Ad} from '../ad';
import {CodeValue} from 'core/model/base-model';

export class Vehicle extends Ad {

  make: CodeValue = new CodeValue();
  model: string;
  year: string;
  color: string;
  transmission: any;
  mileage: string;
  exchangeable: boolean;
}

export enum Transmission {
  AUTOMATIC = 'Automatic',
  MANUAL = 'Manual'
}

export enum VehicleCondition {
  USED = 'Used',
  NEW = 'New'
}
