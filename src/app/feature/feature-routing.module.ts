import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileComponent} from './user/profile/profile.component';
import {ProfileEditComponent} from './user/profile-edit/profile-edit.component';
import {PasswordFormComponent} from './user/password-form/password-form.component';
import {AdsComponent} from './user/ads/ads.component';
import {FavoritesComponent} from './user/favorites/favorites.component';
import {UsersComponent} from './admin/users/users.component';
import {PendingAdsComponent} from './admin/pending-ads/pending-ads.component';
import {CategoryComponent} from './admin/category/category.component';
import {AdComponent} from './items/ad/ad.component';
import {ItemsHomeComponent} from './items/items-home/items-home.component';
import {AdminHomeComponent} from 'feature/admin/admin-home/admin-home.component';
import {CategoryResolver} from 'core/resolvers/category.resolver';
import {ColorResolver} from 'core/resolvers/app.resolver';
import {AuthGuard} from 'core/guards/auth.guard';
import {ManageAdsComponent} from 'feature/admin/manage-ads/manage-ads.component';
import {AdHistoryComponent} from 'feature/admin/ad-history/ad-history.component';
import {UserMessagesComponent} from './user/user-messages/user-messages.component';
import {ContactsComponent} from 'feature/admin/contacts/contacts.component';
import {DeclinedAdsComponent} from 'feature/admin/declined-ads/declined-ads.component';
import {ListItemsComponent} from 'feature/admin/list-items/list-items.component';

const routes: Routes = [
  {path: '', children: [
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'user', children: [
          {path: '', component: ProfileComponent},
          {path: 'edit/:id', component: ProfileEditComponent},
          {path: 'reset', component: PasswordFormComponent},
          {path: 'ads', component: AdsComponent},
          {path: 'messages', component: UserMessagesComponent},
          {path: 'favorites', component: FavoritesComponent},
        ]
      },
      {
        path: 'admin', component: AdminHomeComponent, children: [
          {path: '', component: ManageAdsComponent, children: [
              {path: '', component: PendingAdsComponent},
              {path: 'history', component: AdHistoryComponent},
              {path: 'declined', component: DeclinedAdsComponent}
            ]},
          {path: 'users', component: UsersComponent},
          {path: 'contacts', component: ContactsComponent},
          {path: 'categories', component: CategoryComponent, resolve: {
              categories: CategoryResolver
            }},
          {path: 'list-item', component: ListItemsComponent, resolve: {
              categories: CategoryResolver
            }},
        ]
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ], canActivate: [AuthGuard], canActivateChild: [AuthGuard]
  },
  {path: 'post-ad', component: ItemsHomeComponent, children: [
      {path: '', component: AdComponent, resolve: {
          categories: CategoryResolver,
          colors: ColorResolver
        }}
    ], canActivate: [AuthGuard], canActivateChild: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule {
}
