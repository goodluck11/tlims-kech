import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'shared/shared.module';
import {AuthService} from './services/auth.service';
import {StorageService} from './services/storage.service';
import {FileService} from './services/file.service';
import {CategoryService} from 'core/services/category.service';
import {BrandResolver, CategoryResolver, SubcategoryResolver} from 'core/resolvers/category.resolver';
import {PickListService} from 'core/services/picklist.service';
import {ColorResolver} from 'core/resolvers/app.resolver';
import {CoreService} from 'core/services/core.service';
import {AuthGuard} from 'core/guards/auth.guard';
import {SharedService} from 'core/services/shared.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [],
  providers: [
    AuthService, StorageService, FileService, CategoryService, CategoryResolver, CoreService,
    PickListService, ColorResolver, SubcategoryResolver, AuthGuard, BrandResolver,
    SharedService]
})
export class CoreModule { }
