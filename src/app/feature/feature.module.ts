import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {FeatureRoutingModule} from './feature-routing.module';
import {UsersComponent} from './admin/users/users.component';
import {PickListComponent} from './admin/pick-list/pick-list.component';
import {CategoryComponent} from './admin/category/category.component';
import {PendingAdsComponent} from './admin/pending-ads/pending-ads.component';
import {FavoritesComponent} from './user/favorites/favorites.component';
import {AdsComponent} from './user/ads/ads.component';
import {PasswordFormComponent} from './user/password-form/password-form.component';
import {ProfileComponent} from './user/profile/profile.component';
import {ProfileEditComponent} from './user/profile-edit/profile-edit.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FeatureHomeComponent} from './feature-home/feature-home.component';
import {ElectronicsComponent} from './items/electronics/electronics.component';
import {FashionComponent} from './items/fashion/fashion.component';
import {BeautyHealthComponent} from './items/beauty-health/beauty-health.component';
import {CommercialComponent} from './items/commercial/commercial.component';
import {AdComponent} from './items/ad/ad.component';
import {MobileComponent} from './items/mobile/mobile.component';
import {VehicleComponent} from './items/vehicle/vehicle.component';
import {RepairComponent} from './items/repair/repair.component';
import {CategoryViewComponent} from './items/category-view/category-view.component';
import {ItemsHomeComponent} from './items/items-home/items-home.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';
import {AdminService} from 'feature/admin/admin.service';
import {UserService} from './user/user.service';
import {ItemService} from 'feature/items/item.service';
import { UserHomeComponent } from './user/user-home/user-home.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from 'core/interceptor/auth.interceptor';
import { AdHistoryComponent } from './admin/admin-home/ad-history/ad-history.component';

@NgModule({
  imports: [
    CommonModule,
    FeatureRoutingModule,
    SharedModule
  ],
  declarations: [UsersComponent, PickListComponent, CategoryComponent, PendingAdsComponent, FavoritesComponent, AdsComponent,
    PasswordFormComponent, ProfileComponent, ProfileEditComponent, DashboardComponent, FeatureHomeComponent,
    ElectronicsComponent, FashionComponent, BeautyHealthComponent, CommercialComponent, AdComponent,
    MobileComponent, VehicleComponent, RepairComponent, CategoryViewComponent, ItemsHomeComponent, AdminHomeComponent, UserHomeComponent, AdHistoryComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AdminService, UserService, ItemService]
})
export class FeatureModule { }
