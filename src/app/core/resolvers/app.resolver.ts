import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PickListService} from 'core/services/picklist.service';
import {EnumValues} from 'enum-values';
import {PickListType} from 'core/model/category';
import {ToastrService} from 'ngx-toastr';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AppResolver implements Resolve<any> {

  constructor(private pickListService: PickListService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return undefined;
  }
}

@Injectable()
export class ColorResolver implements Resolve<any> {

  constructor(private pickListService: PickListService, private toast: ToastrService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.pickListService.findByListType(EnumValues.getNameFromValue(PickListType, PickListType.COLOR)).pipe(catchError((err) => {
      this.toast.error('Error loading colors');
      return Observable.throw(err);
    }));
  }
}
