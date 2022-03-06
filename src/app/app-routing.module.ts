import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AdminEditProdcastComponent } from './private/dashboard/admin-edit-prodcast/admin-edit-prodcast.component';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { LoginComponent } from './public/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {path: 'login', component: LoginComponent },
  {path: 'dashboard', component: DashboardComponent },
  {path: 'admineditprodcast', component: AdminEditProdcastComponent },
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
