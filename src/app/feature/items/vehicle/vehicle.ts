import {Ad} from '../ad';

export class Vehicle extends Ad {

  make: string;
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
