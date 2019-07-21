import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV} from 'core/config/env.config';

@Injectable()
export class PickListService {

  private baseUrl = `${ENV.BASE_API}/picklists`;

  constructor(private http: HttpClient) {
  }

  create(data) {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  list() {
    return this.http.get(`${this.baseUrl}/`);
  }

  findAll(post) {
    return this.http.post<any>(this.baseUrl + '/findAll', post);
  }

  getPicklists() {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  findByListType(listType) {
    return this.http.get(`${this.baseUrl}/findByPickListType/${listType}`);
  }

  getPicklistsByByTypeAndCategory(listType, code, subCatCode) {
    return this.http.get(`${this.baseUrl}/findByListTypeAndCategory/${listType}/${code}/${subCatCode}`);
  }

  getPicklistsByByTypeAndCategoryAndParent(listType, code, subCatCode, parentCode) {
    return this.http.get(`${this.baseUrl}/findByListTypeAndCategoryAndParent/${listType}/${code}/${subCatCode}/${parentCode}`);
  }

}
