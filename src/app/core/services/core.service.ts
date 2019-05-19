import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV} from 'core/config/env.config';

@Injectable()
export class CoreService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient) {
  }

  allAds(data) {
    return this.http.post(`${this.baseUrl}/ads/adList`, data);
  }

  allAdsAdvance(data) {
    return this.http.post(`${this.baseUrl}/ads/adListAdvance`, data);
  }

  getBrands(catCode) {
    return this.http.get(`${this.baseUrl}/ads/categoryCode/${catCode}`);
  }

  getAd(id) {
    return this.http.get(`${this.baseUrl}/ads/findById/${id}`);
  }

}
