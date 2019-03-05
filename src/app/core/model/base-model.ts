export class BaseModel {
  id: number;
  createdDate: Date;
  status: boolean;
  code: string;
  fromDate: Date;
  toDate: Date;
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
}
