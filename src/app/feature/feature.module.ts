import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'shared/shared.module';
import {FeatureRoutingModule} from './feature-routing.module';
import {UsersComponent} from './admin/users/users.component';
import {CategoryComponent} from './admin/category/category.component';
import {PendingAdsComponent} from './admin/pending-ads/pending-ads.component';
import {FavoritesComponent} from './user/favorites/favorites.component';
import {AdsComponent} from './user/ads/ads.component';
import {PasswordFormComponent} from './user/password-form/password-form.component';
import {ProfileComponent} from './user/profile/profile.component';
import {ProfileEditComponent} from './user/profile-edit/profile-edit.component';
import {DashboardComponent} from './dashboard/dashboard.component';
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
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from 'core/interceptor/auth.interceptor';
import {ManageAdsComponent} from './admin/manage-ads/manage-ads.component';
import {AdHistoryComponent} from 'feature/admin/ad-history/ad-history.component';
import {ContactComponent} from './items/contact/contact.component';
import {UserMessagesComponent} from './user/user-messages/user-messages.component';
import {JobComponent} from './items/job/job.component';
import {ContactsComponent} from './admin/contacts/contacts.component';
import {ServicesComponent} from './items/services/services.component';
import {GardenComponent} from './items/garden/garden.component';
import {RealEstateComponent} from './items/real-estate/real-estate.component';
import {PetComponent} from './items/pet/pet.component';
import {DeclinedAdsComponent} from './admin/declined-ads/declined-ads.component';
import {ListItemsComponent} from './admin/list-items/list-items.component';
import {ListItemFormComponent} from './admin/list-items/list-item-form/list-item-form.component';
import {ListItemViewComponent} from './admin/list-items/list-item-view/list-item-view.component';

@NgModule({
  imports: [
    CommonModule,
    FeatureRoutingModule,
    SharedModule
  ],
  declarations: [UsersComponent, CategoryComponent, PendingAdsComponent, FavoritesComponent, AdsComponent,
    PasswordFormComponent, ProfileComponent, ProfileEditComponent, DashboardComponent,
    ElectronicsComponent, FashionComponent, BeautyHealthComponent, CommercialComponent, AdComponent,
    MobileComponent, VehicleComponent, RepairComponent, CategoryViewComponent, ItemsHomeComponent,
    AdminHomeComponent, AdHistoryComponent, ManageAdsComponent, ContactComponent,
    UserMessagesComponent, JobComponent, ContactsComponent, ServicesComponent, GardenComponent,
    RealEstateComponent, PetComponent, DeclinedAdsComponent, ListItemsComponent, ListItemFormComponent, ListItemViewComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AdminService, UserService, ItemService]
})
export class FeatureModule { }
