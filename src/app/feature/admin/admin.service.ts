import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV} from 'core/config/env.config';

@Injectable()
export class AdminService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient) {
  }

  authorizeAd(id) {
    return this.http.get(`${this.baseUrl}/ads/activate/${id}`);
  }

  pendingAds(data) {
    return this.http.post(`${this.baseUrl}/ads/pendingAds`, data);
  }

  adHistory(data) {
    return this.http.post(`${this.baseUrl}/ads/adHistory`, data);
  }

  findAll(data) {
    return this.http.post(`${this.baseUrl}/api/users/findAll`, data);
  }

  createContact(data) {
    return this.http.post(`${this.baseUrl}/api/contacts/create`, data);
  }

  findAllContacts(data) {
    return this.http.post(`${this.baseUrl}/api/contacts/findAll`, data);
  }

}
