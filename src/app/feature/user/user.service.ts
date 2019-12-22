import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV} from 'core/config/env.config';

@Injectable()
export class UserService {

  private baseUrl = `${ENV.BASE_API}/api/users`;

  constructor(private http: HttpClient) {
  }

  create(data) {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  updateProfile(data) {
    return this.http.post(`${this.baseUrl}/updateProfile`, data);
  }

  changePassword(data) {
    return this.http.post(`${this.baseUrl}/changePassword`, data);
  }

  findUserAds(data) {
    return this.http.post(`${this.baseUrl}/listUserAds`, data);
  }

  findFavoriteAds(data) {
    return this.http.post(`${ENV.BASE_API}/api/favorites/list`, data);
  }
}
