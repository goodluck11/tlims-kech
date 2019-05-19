import {BaseModel, CodeValue, Condition, TitleDescription} from 'core/model/base-model';

export class Ad extends BaseModel {
  titleDescription: TitleDescription = new TitleDescription();
  images: Array<string> = [];
  adType: any;
  category: CodeValue = new CodeValue();
  subCategory: CodeValue = new CodeValue();
  subCatType: CodeValue = new CodeValue();
  brand: CodeValue = new CodeValue();
  itemCondition: Condition;
  price: any;
  negotiable = false;
  authorized: boolean;
  featured: boolean;
  archived: boolean;
  amount: string;
  brands: string;
}

