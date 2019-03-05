import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileComponent} from './user/profile/profile.component';
import {ProfileEditComponent} from './user/profile-edit/profile-edit.component';
import {PasswordFormComponent} from './user/password-form/password-form.component';
import {AdsComponent} from './user/ads/ads.component';
import {FeatureHomeComponent} from './feature-home/feature-home.component';
import {FavoritesComponent} from './user/favorites/favorites.component';
import {UsersComponent} from './admin/users/users.component';
import {PendingAdsComponent} from './admin/pending-ads/pending-ads.component';
import {CategoryComponent} from './admin/category/category.component';
import {PickListComponent} from './admin/pick-list/pick-list.component';
import {AdComponent} from './items/ad/ad.component';
import {ItemsHomeComponent} from './items/items-home/items-home.component';
import {AdminHomeComponent} from 'feature/admin/admin-home/admin-home.component';

const routes: Routes = [
  {
    path: '', component: FeatureHomeComponent, children: [
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'user', children: [
          {path: '', component: ProfileComponent},
          {path: 'edit/:id', component: ProfileEditComponent},
          {path: 'reset', component: PasswordFormComponent},
          {path: 'ads', component: AdsComponent},
          {path: 'favorites', component: FavoritesComponent},
        ]
      },
      {
        path: 'admin', component: AdminHomeComponent, children: [
          {path: '', component: UsersComponent},
          {path: 'pending', component: PendingAdsComponent},
          {path: 'categories', component: CategoryComponent},
          {path: 'pick-list', component: PickListComponent},
        ]
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  {path: 'post-ad', component: ItemsHomeComponent, children: [
      {path: '', component: AdComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule {
}
