import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {SharedModule} from 'shared/shared.module';
import {IndexComponent} from './public/index/index.component';
import {LoginComponent} from './public/login/login.component';
import {RegisterComponent} from './public/register/register.component';
import {NavbarComponent} from './public/navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FooterComponent} from './public/footer/footer.component';
import {HomeComponent} from './public/home/home.component';
import {CoreModule} from 'core/core.module';
import {ToastrModule} from 'ngx-toastr';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {CategoriesComponent} from './public/views/categories/categories.component';
import {CategoryViewComponent} from './public/views/category-view/category-view.component';
import {SubcategoryComponent} from './public/views/subcategory/subcategory.component';
import {OwlModule} from 'ngx-owl-carousel';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {AuthInterceptor} from 'core/interceptor/auth.interceptor';
import {CodeValueTokenizerPipe} from './public/views/view-pipe/code-value-tokenizer.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PriceRangeComponent} from './public/views/viewComponents/price-range/price-range.component';
import {ConditionComponent} from './public/views/viewComponents/condition/condition.component';
import {BrandComponent} from './public/views/viewComponents/brand/brand.component';
import {ColorComponent} from './public/views/viewComponents/color/color.component';
import {SizeComponent} from './public/views/viewComponents/size/size.component';
import {FeaturedComponent} from './public/views/viewComponents/featured/featured.component';
import {Ng5SliderModule} from 'ng5-slider';
import {RecommendedComponent} from './public/views/viewComponents/recommended/recommended.component';
import {NgxImageZoomModule} from 'ngx-image-zoom';
import {SafetyComponent} from './public/views/safety/safety.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {AboutComponent} from './public/static/about/about.component';
import {FaqComponent} from './public/static/faq/faq.component';
import {PrivacyComponent} from './public/static/privacy/privacy.component';
import {TermsComponent} from './public/static/terms/terms.component';
import {ContactComponent} from './public/static/contact/contact.component';
import {SponsoredComponent} from './public/views/viewComponents/sponsored/sponsored.component';
import {VerificationComponent} from './public/register/verification/verification.component';
import {HowitworksComponent} from './public/static/howitworks/howitworks.component';
import {FeatureHomeComponent} from './feature/feature-home/feature-home.component';
import {UserHomeComponent} from './feature/user/user-home/user-home.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {AuthServiceConfig, FacebookLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {NgxCoolDialogsModule} from 'ngx-cool-dialogs';
import {NgxInputTagModule} from '@ngx-lite/input-tag';
import {BaseComponent} from './public/base.component';
import { ForgotPasswordComponent } from './public/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './public/auth/reset-password/reset-password.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/core/', suffix: '.json'}
  ]);
}


const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('945674899140873')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    CategoriesComponent,
    CategoryViewComponent,
    SubcategoryComponent,
    CodeValueTokenizerPipe,
    PriceRangeComponent,
    ConditionComponent,
    BrandComponent,
    ColorComponent,
    SizeComponent,
    FeaturedComponent,
    RecommendedComponent,
    SafetyComponent,
    AboutComponent,
    FaqComponent,
    PrivacyComponent,
    TermsComponent,
    ContactComponent,
    SponsoredComponent,
    VerificationComponent,
    HowitworksComponent,
    FeatureHomeComponent,
    UserHomeComponent,
    BaseComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    SlickCarouselModule,
    OwlModule,
    CarouselModule,
    NgbModule,
    Ng5SliderModule,
    NgxImageZoomModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    OverlayModule,
    SocialLoginModule,
    NgxCoolDialogsModule.forRoot({
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      color: '#ff6232',
      titles: {
        alert: 'Alert',
        confirm: 'Confirmation'
      }
    }),
    NgxInputTagModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: AuthServiceConfig, useFactory: provideConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
