import {BaseModel, CodeValue, TitleDescription} from '../../core/model/base-model';

export class Ad extends BaseModel {
  titleDescription: TitleDescription;
  images: Array<string> = [];
  adType: any;
  category: CodeValue = new CodeValue();
  subCategory: CodeValue = new CodeValue();
  subCatType: CodeValue = new CodeValue();
  brand: CodeValue = new CodeValue();
  itemCondition: any;
  price: any;
  negotiable: boolean;
  authorized: boolean;
  featured: boolean;
  archived: boolean;

}

