import {CodeValue, Contact} from 'core/model/base-model';

export class Message {
  id: number;
  postId: number;
  contact: Contact = new Contact();
  content: string;
  postCode: string;
  recipient: string;
  source: MessageSource;
  createdDate: Date;
  post: CodeValue = new CodeValue();
}

export enum MessageSource {
  INTERNAL, EXTERNAL
}
