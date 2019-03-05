import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileHolder} from 'angular2-image-upload';

@Component({
  selector: 'tlims-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  fileList: File[] = [];
  @Output()
  images = new EventEmitter<File[]>();

  constructor() {
  }

  ngOnInit() {
  }

  onUploadFinished($event: FileHolder) {
    this.fileList.push($event.file);
    this.images.emit(this.fileList);
  }

  onRemoved($event: FileHolder) {
    const index = this.fileList.indexOf($event.file);
    this.fileList.splice(index, 1);
    this.images.emit(this.fileList);
  }

}
