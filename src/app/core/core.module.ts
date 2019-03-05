import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {AuthService} from './services/auth.service';
import {StorageService} from './services/storage.service';
import {FileService} from './services/file.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [],
  providers: [AuthService, StorageService, FileService]
})
export class CoreModule { }
