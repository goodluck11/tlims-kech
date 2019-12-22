import {Ad} from '../ad';
import {CodeValue} from 'core/model/base-model';

export class Commercial extends Ad {
  powerSource: CodeValue = new CodeValue();
  trayNo: string;
  deckNo: string;
  voltage: string;
  maxTemperature: string;
  shape: CodeValue = new CodeValue();
  weight: string;
  contactForPrice = false;
}
