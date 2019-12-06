import {Ad} from 'feature/items/ad';

export class Pet extends Ad {
  gender: PetGender;
  age: string;
  breed: string;
  breedType: string;
}

export enum BreedType {
  MIXED = 'Mixed Breed',
  PURE = 'Pure Breed'
}

export enum PetAge {
  ADULT = 'Adult',
  YOUNG = 'Young',
  SENIOR = 'Senior',
  BABY = 'Baby'
}

export enum PetGender {
  MALE = 'Male',
  FEMALE = 'Female',
}
