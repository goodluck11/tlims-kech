import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

  constructor() {
  }

  remove(key) {
    if (this.get(key)) {
      localStorage.removeItem(key);
    }
  }

  get(key) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  }

  save(data: { key, data }) {
    if (this.get(data.key)) {
      localStorage.removeItem(data.key);
    }
    localStorage.setItem(data.key, JSON.stringify(data.data));
  }
}
