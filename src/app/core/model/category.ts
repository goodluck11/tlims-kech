import {BaseModel, Code, CodeValue, TitleDescription} from './base-model';

export class Category extends BaseModel {
  categoryCode: Code = new Code();
  titleDescription: TitleDescription = new TitleDescription();
  parentCategory: Category;
  image: string;
}

export class Picklist extends BaseModel {
  pickListcode: Code = new Code();
  titleDescription: TitleDescription = new TitleDescription();
  picklistType: PickListType;
  parentpickListType: PickListType;
  parentList: Picklist;
  category: CodeValue = new CodeValue();
  subCategory: CodeValue = new CodeValue();
}

export enum PickListType {
  COUNTRY = 'Country', STATE = 'State', BRAND = 'Brand',
  ITEM_TYPE = 'Item Type', ITEM_MAKE = 'Item Make', MODEL = 'Model', SUB_TYPE = 'Sub-Type',
  MATERIAL = 'Material', COLOR = 'Color', CLOSURE = 'Closure', SIZE = 'Size',
  STYLE = 'Style', STONE = 'Stone', FASTEN = 'Fastening',
  FEATURE = 'Features', OS = 'Operating System', STORE_TYPE = 'Storage Type',
  STORE_CAPACITY = 'Storage Capacity', RAM = 'Ram', CORES = 'Cores',
  PLATFORM = 'Platform', RATING = 'Rating', YEAR = 'Year',
  VOLUME = 'Volume', FORMULA = 'Formulation', SCENT = 'Scent',
  TONE = 'Tone', SKIN = 'Skin Type', BENEFIT = 'Benefits',
  TARGET_AREA = 'Target Area', AGE_GROUP = 'Age Group', PACKAGE = 'Package',
  PROCESSOR = 'Processor', OUTSOLE = 'Outsole Material', POWER_SOURCE = 'PowerSource',
  SHAPE = 'Shape', BREED = 'Breed', BREED_TYPE = 'Breed Type',
  MOVEMENT = 'Movement', DISPLAY = 'Display', JOB_TYPE = 'Job Type', JOB_EXPERIENCE = 'Years of Experience'
}
