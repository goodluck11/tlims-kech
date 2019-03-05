import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ENV} from '../config/env.config';

@Injectable()
export class FileService {

  private baseUrl = `${ENV.BASE_API}`;

  constructor(private http: HttpClient) {
  }

  imageUpload(name: string, file: File[], data: any): FormData {
    let formData = new FormData();
    if (file.length == 1) {
      formData.append('file', file[0]);
    } else if (file.length > 1) {
      let i;
      for (i = 0; i < file.length; i++) {
        formData.append('file', file[i]);
      }
    }
    formData.append(name, new Blob([JSON.stringify(data)], {type: 'application/json'}));
    return formData;
  }

  uploadFiles(name: string, file: File[], data: any): FormData {
    let formData = new FormData();
    if (file.length == 1) {
      formData.append('file', file[0]);
    } else if (file.length > 1) {
      let i;
      for (i = 0; i < file.length; i++) {
        formData.append('file', file[i]);
      }
    }
    formData.append(name, new Blob([JSON.stringify(data)], {type: 'application/json'}));
    return formData;
  }

  singleUpload(name: string, file: File, data: any): FormData {
    let formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append(name, new Blob([JSON.stringify(data)], {type: 'application/json'}));
    return formData;
  }

  uploadFile(file: File): FormData {
    let formData = new FormData();
    formData.append('file', file, file.name);
    return formData;
  }

  uploadToServer(file: File) {
    const headers = new HttpHeaders().delete( 'Content-Type' );
    return this.http.post(`${this.baseUrl}/storage/upload`, this.uploadFile(file), {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }

  downloadSample(fileName: string) {
    return this.http.get(`${this.baseUrl}/sample/storage/${fileName}`,
      { headers: new HttpHeaders({'Content-Type': 'application/octet-stream'}), responseType: 'blob'});
  }

  getFile(fileName: string) {
    return this.http.get(`${this.baseUrl}/storage/${fileName}`,
      { headers: new HttpHeaders({'Content-Type': 'application/octet-stream'}), responseType: 'blob'});
  }

}
