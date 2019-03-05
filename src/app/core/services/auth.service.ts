import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV} from '../config/env.config';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {
  }

  login(data) {
    return this.http.post(`${this.baseUrl}/auth`, data);
  }

  register(data) {
    return this.http.post(`${this.baseUrl}/users/create`, data);
  }

  getToken() {
    return this.storage.get('currentUser').token;
  }

  getCurrentUser() {
    return this.storage.get('currentUser') ? JSON.parse(this.storage.get('currentUser').user) : this.storage.get('currentUser');
  }

  logout() {
    this.storage.remove('currentUser');
    this.router.navigateByUrl('/');
  }

}
