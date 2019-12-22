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

export class Contact {
  name: string;
  phoneNumber: string;
  email: string;

  static of(name, phoneNumber, email) {
    const contact = new Contact();
    contact.name = name;
    contact.phoneNumber = phoneNumber;
    contact.email = email;
    return contact;
  }
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
  USED = 'Used',
  NEW = 'New',
  FOREIGN = 'Foreign used',
  LOCAL = 'Local used'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNISEX = 'Unisex'
}
