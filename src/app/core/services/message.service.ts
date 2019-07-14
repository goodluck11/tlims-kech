import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ENV} from 'core/config/env.config';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient) {
  }

  addMesssage(data) {
    return this.http.post(`${this.baseUrl}/messages/create`, data);
  }

  getUserMessages(data) {
    return this.http.post(`${this.baseUrl}/api/messages/getAllUserMessages`, data);
  }
}
