import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AdminEditProdcastComponent } from './private/dashboard/admin-edit-prodcast/admin-edit-prodcast.component';
import { CommentsComponent } from './private/dashboard/comments/comments.component';
import { CreateCategoryComponent } from './private/dashboard/create-category/create-category.component';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DeletePodcastListComponent } from './private/dashboard/delete-podcast-list/delete-podcast-list.component';
import { EditLanguageComponent } from './private/dashboard/edit-language/edit-language.component';
import { RjApprovalComponent } from './private/dashboard/rj-approval/rj-approval.component';
import { UserSpotsComponent } from './private/dashboard/user-spots/user-spots.component';
import { LoginComponent } from './public/login/login.component';
import { PushNotificationComponent } from './private/dashboard/push-notification/push-notification.component';
import { MobileUserComponent } from './private/dashboard/mobile-user/mobile-user.component';
import { ReportedComponent } from './private/dashboard/reported/reported.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {path: 'login', component: LoginComponent },
  {path: 'dashboard', component: DashboardComponent },
  {path: 'admineditprodcast', component: AdminEditProdcastComponent },
  {path: 'create-category', component: CreateCategoryComponent },
  {path: 'user-spot', component: UserSpotsComponent },
  {path: 'create-language', component: EditLanguageComponent },
  {path: 'rj-approvals', component: RjApprovalComponent },
  {path: 'podcast-delete', component: DeletePodcastListComponent },
  {path: 'comments', component: CommentsComponent },
  {path: 'push-notification', component: PushNotificationComponent },
  {path: 'app-user', component: MobileUserComponent },
  {path: 'reported', component: ReportedComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
