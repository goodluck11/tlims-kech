import {Injectable} from '@angular/core';
import {ENV} from 'core/config/env.config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListItemService {

  private baseUrl = `${ENV.BASE_API}/listItems`;

  constructor(private http: HttpClient) {
  }

  create(data) {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  update(data) {
    return this.http.post(`${this.baseUrl}/update`, data);
  }

  list() {
    return this.http.get(`${this.baseUrl}/`);
  }

  findAll(post) {
    return this.http.post<any>(this.baseUrl + '/findAll', post);
  }

  findByListType(listType) {
    return this.http.get(`${this.baseUrl}/findByListType/${listType}`);
  }

  findByListTypeSubcategoryAndParentList(listType, subCatCode, parentCode) {
    return this.http.get(`${this.baseUrl}/findByListTypeSubcategoryAndParentList/${listType}/${subCatCode}/${parentCode}`);
  }

  findByListTypeAndSubcategory(listType, subCatCode) {
    return this.http.get(`${this.baseUrl}/findByListTypeAndSubcategory/${listType}/${subCatCode}`);
  }
}
