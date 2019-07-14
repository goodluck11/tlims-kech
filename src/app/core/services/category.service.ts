import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from 'core/model/category';
import {ENV} from 'core/config/env.config';
import {FileService} from 'core/services/file.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

@Injectable()
export class CategoryService {

  private baseUrl = `${ENV.BASE_API}/categories`;
  private categories$: Observable<any>;

  constructor(private http: HttpClient, private fileService: FileService) { }

  create(data: Category, file: File) {
    const headers = new HttpHeaders().delete( 'Content-Type' );
    return this.http.post(`${this.baseUrl}/create`,  this.fileService.singleUpload('category', file, data), {
      headers: headers
    });
  }

  list() {
    return this.http.get(`${this.baseUrl}`);
  }

  findAll(post) {
    return this.http.post<any>(this.baseUrl + '/findAll', post);
  }

  getCategories() {
    if (!this.categories$) {
      this.categories$ = this.http.get(`${this.baseUrl}/categories`).pipe(shareReplay());
    }
    return this.categories$;
    // return this.http.get(`${this.baseUrl}/categories`);
  }

  getParentCategories() {
    return this.http.get(`${this.baseUrl}/parentCategories`);
  }

  getSubCategories(code) {
    return this.http.get(`${this.baseUrl}/subcategories/${code}`);
  }

}
