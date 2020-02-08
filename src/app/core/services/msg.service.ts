import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

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
      if ((<Array<any>>data['error']).length > 1) {
        this.toastr.error('Server error occurred', 'Error!');
        return;
      }
      this.toastr.error((<Array<any>>data['error'])[0].message, 'Error!');
    }
  }
}
