import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {IndexComponent} from './public/index/index.component';
import {LoginComponent} from './public/login/login.component';
import {RegisterComponent} from './public/register/register.component';
import {HomeComponent} from './public/home/home.component';
import {BrandResolver, CategoryResolver, SubcategoryResolver} from 'core/resolvers/category.resolver';
import {CategoriesComponent} from './public/views/categories/categories.component';
import {CategoryViewComponent} from './public/views/category-view/category-view.component';
import {SubcategoryComponent} from './public/views/subcategory/subcategory.component';
import {AuthGuard} from 'core/guards/auth.guard';
import {AboutComponent} from './public/static/about/about.component';
import {FaqComponent} from './public/static/faq/faq.component';
import {PrivacyComponent} from './public/static/privacy/privacy.component';
import {ContactComponent} from './public/static/contact/contact.component';
import {VerificationComponent} from './public/register/verification/verification.component';
import {HowitworksComponent} from './public/static/howitworks/howitworks.component';
import {FeatureHomeComponent} from './feature/feature-home/feature-home.component';
import {ForgotPasswordComponent} from './public/auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './public/auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'tlims', component: AppComponent, children: [
      {path: 'bo', component: FeatureHomeComponent, loadChildren: './feature/feature.module#FeatureModule',
        canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
      {
        path: '', component: IndexComponent, children: [
          {path: '', component: HomeComponent, resolve: {
              categories: CategoryResolver
            }},
          {path: 'sign-in', component: LoginComponent},
          {path: 'sign-up', component: RegisterComponent},
          {path: 'forgotPassword', component: ForgotPasswordComponent},
          {path: 'resetPassword', component: ResetPasswordComponent},
          {path: 'verify/:code', component: VerificationComponent},
          {path: 'about-us', component: AboutComponent},
          {path: 'how-it-works', component: HowitworksComponent},
          {path: 'faq', component: FaqComponent},
          {path: 'privacy', component: PrivacyComponent},
          {path: 'contact-us', component: ContactComponent},
          {path: 'all-ads', component: CategoriesComponent, resolve: {
              categories: CategoryResolver
            }},
          {path: 'ad/:id/:title/:code', component: CategoryViewComponent},
          {path: 'ad/:catCode', component: SubcategoryComponent, resolve: {
              subCategories: SubcategoryResolver,
              brands: BrandResolver
            }}
        ]
      },
    ]
  },
  {path: '', redirectTo: 'tlims', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
