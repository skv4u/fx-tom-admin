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
import { CreateCategoryComponent } from './private/dashboard/create-category/create-category.component';
import { WebService } from './shared/services/web.service';
import { HttpClientModule } from '@angular/common/http';
import { ProdcastService } from './shared/services/prodcast.service';
import {ToastService} from './shared/services/toast.service';
import { GenericHeaderComponent } from './private/generic-header/generic-header.component';
import { RjApprovalComponent } from './private/dashboard/rj-approval/rj-approval.component';
import { EditLanguageComponent } from './private/dashboard/edit-language/edit-language.component';
import { PageLoaderComponent } from './private/page-loader/page-loader.component';
import { ApprovalPopupComponent } from './private/dashboard/approval-popup/approval-popup.component';
import { DeletePodcastListComponent } from './private/dashboard/delete-podcast-list/delete-podcast-list.component';
import { CommentsComponent } from './private/dashboard/comments/comments.component';
import { UserSpotsComponent } from './private/dashboard/user-spots/user-spots.component';
import { PushNotificationComponent } from './private/dashboard/push-notification/push-notification.component';
import { SearchlistPipe } from './shared/pipes/searchlist.pipe';
import { MobileUserComponent } from './private/dashboard/mobile-user/mobile-user.component';
import { ReportedComponent } from './private/dashboard/reported/reported.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PodcastListComponent,
    DashboardComponent,
    AdminEditProdcastComponent,
    CreateCategoryComponent,
    GenericHeaderComponent,
    RjApprovalComponent,
    EditLanguageComponent,
    PageLoaderComponent,
    ApprovalPopupComponent,
    DeletePodcastListComponent,
    CommentsComponent,
    UserSpotsComponent,
    PushNotificationComponent,
    SearchlistPipe,
    MobileUserComponent,
    ReportedComponent
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
