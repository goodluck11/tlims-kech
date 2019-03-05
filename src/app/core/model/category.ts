import {BaseModel, Code, TitleDescription} from './base-model';

export class Category extends BaseModel {
  categoryCode: Code;
  titleDescription: TitleDescription;
  parentCategory: Category;
}

export class Picklist extends BaseModel {
  pickListcode: Code;
  titleDescription: TitleDescription;
  picklistType: any;
  parentpickListType: any;
  parentList: Picklist;
  category: Category;
  subCategory: Category;
}
