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
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {CategoriesComponent} from './public/views/categories/categories.component';
import {CategoryViewComponent} from './public/views/category-view/category-view.component';
import {SubcategoryComponent} from './public/views/subcategory/subcategory.component';
import {SwiperModule} from 'angular2-useful-swiper';
import {OwlModule} from 'ngx-owl-carousel';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from 'core/interceptor/auth.interceptor';
import { CodeValueTokenizerPipe } from './public/views/view-pipe/code-value-tokenizer.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PriceRangeComponent } from './public/views/viewComponents/price-range/price-range.component';
import { ConditionComponent } from './public/views/viewComponents/condition/condition.component';
import { BrandComponent } from './public/views/viewComponents/brand/brand.component';
import { ColorComponent } from './public/views/viewComponents/color/color.component';
import { SizeComponent } from './public/views/viewComponents/size/size.component';
import { FeaturedComponent } from './public/views/viewComponents/featured/featured.component';
import { Ng5SliderModule } from 'ng5-slider';
import { RecommendedComponent } from './public/views/viewComponents/recommended/recommended.component';

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
    RecommendedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    SlickCarouselModule,
    SwiperModule,
    OwlModule,
    NgbModule,
    Ng5SliderModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
