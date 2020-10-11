import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {isArray} from 'core/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  constructor(private toastr: ToastrService) {
  }

  success(data) {
    this.toastr.success(data, 'Success!');
  }

  error(data) {
    if (data['error']) {
      if (isArray(data['error'])) {
        const errorList = data['error'] as Array<any>;
        if (errorList.length > 1) {
          this.toastr.error('Server error occurred', 'Error!');
          return;
        }
        this.toastr.error(errorList[0].message, 'Error!');
      }
      if (!isArray(data['error'])) {
        this.toastr.error(data['error'].message, 'Error!');
      }
    }
  }
}
