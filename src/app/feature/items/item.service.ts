import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ENV} from 'core/config/env.config';
import {FileService} from 'core/services/file.service';

@Injectable()
export class ItemService {

  private baseUrl = `${ENV.BASE_API}`;
  private _endPoint: string;

  constructor(private http: HttpClient, private fileService: FileService) {
  }

  get endPoint(): string {
    return this._endPoint;
  }

  set endPoint(endPoint: string) {
    this._endPoint = endPoint;
  }

  create(key: string, data: any, file: File[]) {
    const headers = new HttpHeaders().delete('Content-Type');
    return this.http.post(`${this.baseUrl}/api/${this.endPoint}/create`, this.fileService.imageUpload(key, file, data), {
      headers: headers
    });
  }
}
