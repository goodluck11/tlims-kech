import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {CategoryService} from 'core/services/category.service';
import {_throw} from 'rxjs/observable/throw';
import {CoreService} from 'core/services/core.service';

@Injectable()
export class CategoryResolver  implements Resolve<any> {

  constructor(private categoryService: CategoryService, private toast: ToastrService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.categoryService.getCategories().pipe(catchError((err) => {
      this.toast.error('Error loading categories');
      return _throw(err);
    }));
  }
}

@Injectable()
export class SubcategoryResolver  implements Resolve<any> {

  constructor(private categoryService: CategoryService, private toast: ToastrService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const categoryCode = route.url[1].path;
    return this.categoryService.getSubCategories(categoryCode).pipe(catchError((err) => {
      this.toast.error('Error loading subcategories');
      return _throw(err);
    }));
  }
}

@Injectable()
export class BrandResolver  implements Resolve<any> {

  constructor(private coreService: CoreService, private toast: ToastrService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const categoryCode = route.url[1].path;
    return this.coreService.getBrands(categoryCode).pipe(catchError((err) => {
      this.toast.error('Error loading brand');
      return _throw(err);
    }));
  }
}
