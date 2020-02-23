import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EnumValues} from 'enum-values';
import {PickListType} from 'core/model/category';
import {ToastrService} from 'ngx-toastr';
import {catchError} from 'rxjs/operators';
import {ListItemService} from 'core/services/list-item.service';

@Injectable()
export class AppResolver implements Resolve<any> {

  constructor(private listItemService: ListItemService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return undefined;
  }
}

@Injectable()
export class ColorResolver implements Resolve<any> {

  constructor(private listItemService: ListItemService, private toast: ToastrService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.listItemService.findByListType(EnumValues.getNameFromValue(PickListType, PickListType.COLOR)).pipe(catchError((err) => {
      this.toast.error('Error loading colors');
      return Observable.throw(err);
    }));
  }
}
