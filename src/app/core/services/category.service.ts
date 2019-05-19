import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from 'core/model/category';
import {ENV} from 'core/config/env.config';
import {FileService} from 'core/services/file.service';

@Injectable()
export class CategoryService {

  private baseUrl = `${ENV.BASE_API}/categories`;

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
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getSubCategories(code) {
    return this.http.get(`${this.baseUrl}/subcategories/${code}`);
  }

}