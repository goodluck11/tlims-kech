import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {IndexComponent} from './public/index/index.component';
import {LoginComponent} from './public/login/login.component';
import {RegisterComponent} from './public/register/register.component';
import {HomeComponent} from './public/home/home.component';

const routes: Routes = [
  {
    path: 'tlims', component: AppComponent, children: [
      {
        path: '', component: IndexComponent, children: [
          {path: '', component: HomeComponent},
          {path: 'sign-in', component: LoginComponent},
          {path: 'sign-up', component: RegisterComponent},
          {path: 'bo', loadChildren: './feature/feature.module#FeatureModule'}
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
