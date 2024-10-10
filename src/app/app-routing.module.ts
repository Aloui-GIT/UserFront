import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { FormsListComponent } from './forms-list/forms-list.component';
import { FormDetailComponent } from './form-detail/form-detail.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { AuthGuard } from './Components/Auth/auth.guard';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: AppComponent }, // Updated to use DashboardComponent
  { path: '', redirectTo: 'forms', pathMatch: 'full'   },
  { path: 'register', component: RegisterComponent,canActivate: [AuthGuard] },
  { path: 'forms', component: FormsListComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'form/:id', component: FormDetailComponent,canActivate: [AuthGuard] },
  { path: 'Setting', component: UserSettingsComponent, canActivate: [AuthGuard] },
  { path: 'History', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
