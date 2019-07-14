import {BaseModel} from 'core/model/base-model';

export class User extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  role: any;
}

export class ChangePasswordRequest {
  currentPassword: string;
  password: string;
  cpassword: string;
}
