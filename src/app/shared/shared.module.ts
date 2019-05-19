import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormGroupComponent} from './components/form-group/form-group.component';
import {FormErrorComponent} from './components/form-error/form-error.component';
import {DividerComponent} from './components/divider/divider.component';
import {ContentComponent} from './components/content/content.component';
import {AccordionComponent} from './components/accordion/accordion.component';
import {MediaComponent} from './components/media/media.component';
import {GridComponent} from './components/grid/grid.component';
import {TabsComponent} from './components/tab/tabs/tabs.component';
import {TabComponent} from './components/tab/tab/tab.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonDirective} from './directives/button.directive';
import {InputDirective} from './directives/input.directive';
import {AmountComponent} from './components/amount/amount.component';
import {MoneyDirective} from './directives/money.directive';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {RadioComponent} from './components/radio/radio.component';
import {ImageUploadComponent} from './components/image-upload/image-upload.component';
import {ImageUploadModule} from 'angular2-image-upload';
import {SideMenuComponent} from './components/menu/side-menu/side-menu.component';
import {SideSubMenuComponent} from './components/menu/side-sub-menu/side-sub-menu.component';
import {ModalComponent} from './components/modal/modal.component';
import {BlockUIModule} from 'ng-block-ui';
import {DisabledDirective} from 'shared/directives/disabled.directive';
import {DescriptionBoxComponent} from './components/description-box/description-box.component';
import {NgxEditorModule} from 'ngx-editor';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {SearchBoxComponent} from './components/search-box/search-box.component';
import {ToolBoxComponent} from './components/tool-box/tool-box.component';
import {NgPipesModule} from 'ngx-pipes';
import {LightBoxComponent} from './components/light-box/light-box.component';
import {RouterModule} from '@angular/router';


const SHARED_COMPONENTS: any = [
  FormGroupComponent,
  FormErrorComponent,
  DividerComponent,
  ContentComponent,
  AccordionComponent,
  MediaComponent,
  GridComponent,
  TabComponent,
  TabsComponent,
  ButtonDirective,
  InputDirective,
  AmountComponent,
  MoneyDirective,
  ImageUploadComponent,
  CheckboxComponent,
  RadioComponent,
  SideMenuComponent,
  SideSubMenuComponent,
  ModalComponent,
  DescriptionBoxComponent,
  DisabledDirective,
  BreadcrumbComponent,
  SearchBoxComponent,
  ToolBoxComponent,
  LightBoxComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot(),
    FormsModule,
    RouterModule,
    BlockUIModule.forRoot(),
    NgxEditorModule,
    NgPipesModule
  ],
  declarations: [...SHARED_COMPONENTS],
  exports: [...SHARED_COMPONENTS, ReactiveFormsModule, HttpClientModule, FormsModule, RouterModule, ImageUploadModule, BlockUIModule,
    NgPipesModule],
  providers: [DecimalPipe]
})
export class SharedModule { }
