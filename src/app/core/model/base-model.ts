import {PageRequest} from 'core/model/page-request';
import {Paging} from 'core/model/paging';

export class BaseModel {
  id: number;
  createdDate: Date;
  createdBy: string;
  status: boolean;
  code: string;
  fromDate: Date;
  toDate: Date;
  paging: Paging = new Paging();
}

export class Code {
  dataCode: string;
}

export class TitleDescription {
  title: string;
  description: string;
}

export class CodeValue {
  code: string;
  name: string;

  static of(code, name) {
    const cValue = new CodeValue();
    cValue.code = code;
    cValue.name = name;
    return cValue;
  }
}

export enum Condition {
  USED = 'USED',
  NEW = 'NEW'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNISEX = 'Unisex'
}
