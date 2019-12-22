import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ENV} from 'core/config/env.config';

@Injectable()
export class CoreService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient) {
  }

  allAds(data) {
    return this.http.post(`${this.baseUrl}/ads/adList`, data);
  }

  featuredAds(data) {
    return this.http.post(`${this.baseUrl}/ads/featuredAds`, data);
  }

  archivedAds(data) {
    return this.http.post(`${this.baseUrl}/ads/archivedAds`, data);
  }

  sponsoredAds(data) {
    return this.http.post(`${this.baseUrl}/ads/adSponsored`, data);
  }

  globalSearch(data) {
    return this.http.post(`${this.baseUrl}/ads/globalSearch`, data);
  }

  allAdsAdvance(data) {
    return this.http.post(`${this.baseUrl}/ads/advanceAdListing`, data);
  }

  getBrands(catCode) {
    return this.http.get(`${this.baseUrl}/ads/categoryCode/${catCode}`);
  }

  getAd(id) {
    return this.http.get(`${this.baseUrl}/ads/findById/${id}`);
  }

  addFavorite(data) {
    return this.http.post(`${this.baseUrl}/api/favorites/create`, data, {responseType: 'text'});
  }

  removeFavorite(postId) {
    return this.http.delete(`${this.baseUrl}/api/favorites/remove/${postId}`, {responseType: 'text'});
  }

  favoriteAdded(postId) {
    return this.http.get(`${this.baseUrl}/api/favorites/added/${postId}`);
  }

}
