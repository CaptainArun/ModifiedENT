import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MaterialModuleControls } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbsModule } from 'ng6-breadcrumbs';
import { DxSchedulerModule } from 'devextreme-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { BMSUxModule } from './ux/bms.ux.module';
import { BMSTableModule } from './ux/bmstable/bms-table.module';
import 'hammerjs';
import { HomeComponent } from './home/home.component';
import { AppNavigationComponent } from './core/app.navigation.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomHttpService } from './core/custom-http.service';
import { AuthService } from './core/auth.service';
import { HttpErrorInterceptor } from './core/httpErrorInterceptor';
import { LoadingScreenInterceptor } from './common/loadingscreen-interceptor.service';
import { LoadingScreenService } from './common/loading-screen.service';
import { PageNotFoundComponent } from './home/page-not-found.component';
import { CommonModuleComponent } from './common/common.module';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppNavigationComponent,        
    NavMenuComponent,
    PageNotFoundComponent
  ],
  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    CommonModuleComponent,
    FormsModule,
    MaterialModuleControls,
    ReactiveFormsModule,
    DxSchedulerModule,
    BreadcrumbsModule,
    NgbModule,
    BMSUxModule,
    BMSTableModule,    
    AppRoutingModule,
    NgxChartsModule,
    NgxMaterialTimepickerModule,
    NgxQRCodeModule,
    ImageCropperModule,
  ],


  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true
    },
    LoadingScreenService, CustomHttpService, AuthService, DatePipe
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }


