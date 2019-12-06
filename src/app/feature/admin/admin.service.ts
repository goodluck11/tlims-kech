import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV} from 'core/config/env.config';

@Injectable()
export class AdminService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient) {
  }

  rejectAd(data) {
    return this.http.post(`${this.baseUrl}/ads/rejectAd`, data);
  }

  approveAd(data) {
    return this.http.post(`${this.baseUrl}/ads/approveAd`, data);
  }

  pendingAds(data) {
    return this.http.post(`${this.baseUrl}/ads/pendingAds`, data);
  }

  declinedAds(data) {
    return this.http.post(`${this.baseUrl}/ads/declinedAds`, data);
  }

  activateOrDeactivateAd(data) {
    return this.http.post(`${this.baseUrl}/ads/activateOrDeactivate`, data);
  }

  featuredOrNot(data) {
    return this.http.post(`${this.baseUrl}/ads/featuredOrNot`, data);
  }

  sponsoredOrNot(data) {
    return this.http.post(`${this.baseUrl}/ads/sponsoredOrNot`, data);
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
