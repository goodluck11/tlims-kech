import {Ad} from 'feature/items/ad';

export class Estate extends Ad {
  brokerFeeFg = false;
  squareMeter: any;
  parkingSpaceFg = false;
  furnishType: FurnishType;
  capacity: number;
  facilities: string[];
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
