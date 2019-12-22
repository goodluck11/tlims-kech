import {Ad} from 'feature/items/ad';
import {CodeValue} from 'core/model/base-model';

export class Pet extends Ad {
  gender: PetGender;
  age: CodeValue = new CodeValue();
  breed: CodeValue = new CodeValue();
  breedType: CodeValue = new CodeValue();
}

export enum PetGender {
  MALE = 'Male',
  FEMALE = 'Female',
}
