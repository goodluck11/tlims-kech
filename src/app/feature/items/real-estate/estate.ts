import {Ad} from 'feature/items/ad';
import {CodeValue} from 'core/model/base-model';

export class Estate extends Ad {
  brokerFeeFg = false;
  squareMeter: any;
  parkingSpaceFg = false;
  furnishType: FurnishType;
  capacity: number;
  facilities: Array<CodeValue> = [];
  contactForPrice = false;
  totalRoom: number;
  totalBathroom: number;
  petsAllowed = false;
  smokingAllowed = false;
}

export enum FurnishType {
  FURNISHED = 'Furnished',
  SEMI = 'Semi-Furnished',
  UNFURNISHED = 'Unfurnished'
}
