import {Ad} from '../ad';

export class Commercial extends Ad {
  powerSource: string;
  trayNo: string;
  deckNo: string;
  voltage: string;
  maxTemperature: string;
  shape: string;
  weight: string;
  contactForPrice = false;
}
