import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ENV} from '../config/env.config';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {TLIMS_CONST} from 'core/constant/tlims.const';
import {APP_URL} from 'core/constant/tlims.url';

@Injectable()
export class AuthenticationService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {
  }

  redirectUrl(val) {
    this.storage.save({key: TLIMS_CONST.REDIRECT_KEY, data: val});
  }

  getRedirectUrl() {
    return this.storage.get(TLIMS_CONST.REDIRECT_KEY);
  }

  removeRedirectUrl() {
    this.storage.remove(TLIMS_CONST.REDIRECT_KEY);
  }

  login(data) {
    return this.http.post(`${this.baseUrl}/auth`, data);
  }

  findByUserName(username: string) {
    return this.http.get(`${this.baseUrl}/api/users/findByUsername/${username}`);
  }

  register(data) {
    return this.http.post(`${this.baseUrl}/auth/create`, data);
  }

  fbLogin(data) {
    let httpParam = new HttpParams();
    httpParam = httpParam.set('code', data);
    return this.http.get(`${this.baseUrl}/auth/fbLogin`, {params: httpParam});
  }

  verifyAccount(code) {
    return this.http.get(`${this.baseUrl}/auth/verify/${code}`);
  }

  getToken() {
    return this.storage.get('currentUser') ? this.storage.get('currentUser').token : null;
  }

  getCurrentUser() {
    return this.storage.get('currentUser') ? JSON.parse(this.storage.get('currentUser').user) : this.storage.get('currentUser');
  }

  currentUser() {
    return this.http.get(`${this.baseUrl}/api/users/getCurrentUserDetails`);
  }

  isTokenPresent() {
    return !isNullOrUndefined(this.getToken());
  }

  isLoggedIn = (): boolean => this.isTokenPresent();

  logout() {
    this.storage.remove('currentUser');
    this.router.navigateByUrl(APP_URL.login);
  }

}
