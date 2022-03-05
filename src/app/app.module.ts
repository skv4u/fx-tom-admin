import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './public/login/login.component';
import { SignupComponent } from './public/signup/signup.component';
import { PodcastListComponent } from './private/podcast-list/podcast-list.component';
import { ConfigurationMicroService } from './shared/services/configuration-micro.service';
import { CommonService } from './shared/services/common.service';
import { LocalstorageService } from './shared/services/localstorage.service';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { AdminEditProdcastComponent } from './private/dashboard/admin-edit-prodcast/admin-edit-prodcast.component';
import { EditProdcastComponent } from './private/dashboard/edit-prodcast/edit-prodcast.component';
import { CreateCategoryComponent } from './private/dashboard/create-category/create-category.component';
import { WebService } from './shared/services/web.service';
import { HttpClientModule } from '@angular/common/http';
import { ProdcastService } from './shared/services/prodcast.service';
import {ToastService} from './shared/services/toast.service'
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PodcastListComponent,
    DashboardComponent,
    AdminEditProdcastComponent,
    EditProdcastComponent,
    CreateCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ConfigurationMicroService,CommonService,LocalstorageService,WebService,ProdcastService,ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
